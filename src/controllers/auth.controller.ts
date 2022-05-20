import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { HttpException } from "../exceptions/HttpException";
import User from "../models/user.model";
import { LoginRequest, RegisterRequest } from "../interfaces/auth.interface";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { UserPayload } from "../interfaces/user.interface";
import { IMAGE_URL_PREFIX } from "../utils/constants";
import fileUpload from "express-fileupload";
import storage from "../config/storage";
import { encodeImageToBlurhash } from "../utils/helpers";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new HttpException(400, "Konten tidak valid", errors.array());
    }

    const { email, password, name, majority, entryYear } =
      req.body as RegisterRequest;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new HttpException(400, "Email telah digunakan");
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      majority,
      entryYear,
    });

    res.json({ message: "User berhasil terdaftar", data: newUser });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new HttpException(400, "Konten tidak valid", errors.array());
    }

    const { email, password } = req.body as LoginRequest;

    const existingUser = await User.findOne({ where: { email } });
    if (!existingUser) {
      throw new HttpException(404, "Email tidak ditemukan");
    }

    const isPasswordMatch = await bcryptjs.compare(
      password,
      existingUser.password
    );
    if (!isPasswordMatch) {
      throw new HttpException(401, "Password salah");
    }

    const token = jwt.sign({ userId: existingUser.id }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({ message: "Login berhasil", data: { token } });
  } catch (err) {
    next(err);
  }
};

export const getAuthenticatedUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const foundUser = await User.findOne({
      where: { id: req.user.id },
    });

    if (!foundUser) {
      throw new HttpException(404, "User tidak ditemukan");
    }

    res.json({
      message: "Profil berhasil didapatkan berdasarkan id",
      data: foundUser,
    });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new HttpException(400, "Body tidak valid", errors.array());
    }

    const payload = req.body as UserPayload;

    delete payload.isAdmin;
    delete payload.isVerified;

    const foundUser = await User.findOne({
      where: { id: req.user.id },
    });

    if (!foundUser) {
      throw new HttpException(404, "User tidak ditemukan");
    }

    if (foundUser.id == req.user.id) {
      await foundUser.update(payload);
      res.json({ message: "User berhasil diupdate", data: foundUser });
    } else {
      throw new HttpException(403, "Forbidden");
    }
  } catch (err) {
    next(err);
  }
};

export const updateProfileImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { files } = req;

  try {
    if (!files) {
      throw new HttpException(400, "Tidak ada gambar");
    } else {
      try {
        const { image } = files as { image: fileUpload.UploadedFile };

        const filePath = `users/${image.name}`;

        await storage.from("images").upload(filePath, image.data, {
          cacheControl: "3600",
          upsert: false,
          contentType: image.mimetype,
        });

        const foundUser = await User.findOne({
          where: { id: req.user.id },
        });

        if (!foundUser) {
          throw new HttpException(404, "User tidak ditemukan");
        }

        const profileImageURL = `${IMAGE_URL_PREFIX}/${filePath}`;

        const blurHash = (await encodeImageToBlurhash(
          profileImageURL
        )) as string;

        await foundUser.update({
          profileImageURL,
          blurHash,
        });

        res.json({
          message: "Gambar profil berhasil diperbarui",
          data: null,
        });
      } catch (err) {
        console.log(err);
        throw new HttpException(500, "Failed to upload");
      }
    }
  } catch (err) {
    next(err);
  }
};
