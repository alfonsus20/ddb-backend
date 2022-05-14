import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { HttpException } from "../exceptions/HttpException";
import { UserPayload, UserQuery } from "../interfaces/user.interface";
import User from "../models/user.model";
import { Op } from "sequelize";
import fileUpload from "express-fileupload";
import storage from "../config/storage";
import { IMAGE_URL_PREFIX } from "../utils/constants";

export const getAllUsersFilteredAndPaginated = async (
  req: Request<{}, {}, {}, UserQuery>,
  res: Response,
  next: NextFunction
) => {
  const {
    page = 0,
    rowsPerPage = 10,
    sortDirection = "ASC",
    name = "",
  } = req.query;

  try {
    const users = await User.findAll({
      offset: page * rowsPerPage,
      limit: rowsPerPage,
      order: [["name", sortDirection]],
      where: { name: { [Op.iLike]: `%${name.toLowerCase()}%` } },
    });

    res.json({
      message: "Semua user berhasil didapatkan (paginated)",
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.findAll();

    res.json({
      message: "Semua user berhasil didapatkan",
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const foundUser = await User.findOne({
      where: { id: req.params.id },
    });

    if (!foundUser) {
      throw new HttpException(404, "User tidak ditemukan");
    }

    res.json({
      message: "User berhasil didapatkan berdasarkan id",
      data: foundUser,
    });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (
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
      where: { id: req.params.id },
    });

    if (!foundUser) {
      throw new HttpException(404, "User tidak ditemukan");
    }

    if (foundUser.id == req.user.id || req.user.isAdmin) {
      await foundUser.update(payload);
      res.json({ message: "User berhasil diupdate", data: foundUser });
    } else {
      throw new HttpException(403, "Forbidden");
    }
  } catch (err) {
    next(err);
  }
};

export const uploadProfileImage = async (
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

        res.json({
          message: "File berhasil diupload",
          data: `${IMAGE_URL_PREFIX}/${filePath}`,
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

export const makeUserAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const foundUser = await User.findOne({
      where: { id: req.params.id },
    });

    if (!foundUser) {
      throw new HttpException(404, "User tidak ditemukan");
    }

    await foundUser.update({ isAdmin: true });
    res.json({ message: "User berhasil dijadikan admin", data: null });
  } catch (err) {
    next(err);
  }
};

export const makeUserVerified = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const foundUser = await User.findOne({
      where: { id: req.params.id },
    });

    if (!foundUser) {
      throw new HttpException(404, "User tidak ditemukan");
    }

    await foundUser.update({ isVerified: true });
    res.json({ message: "User berhasil diverifikasi", data: null });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const foundUser = await User.findOne({
      where: { id: req.params.id },
    });

    if (!foundUser) {
      throw new HttpException(404, "User tidak ditemukan");
    }

    await foundUser.destroy();
    res.json({ message: "User berhasil dihapus", data: null });
  } catch (err) {
    next(err);
  }
};
