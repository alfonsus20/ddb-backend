import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fileUpload from 'express-fileupload';
import { Prisma } from '@prisma/client';
import HttpException from '../exceptions/HttpException';
import { LoginRequest, RegisterRequest } from '../interfaces/auth.interface';
import { JWT_SECRET, storage } from '../config';
import { IMAGE_URL_PREFIX, USER_SHOWN_ATTRIBUTES } from '../utils/constants';

import { encodeImageToBlurhash, errorHandler } from '../utils/helpers';
import prisma from '../utils/prisma';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new HttpException(400, 'Konten tidak valid', errors.array());
    }

    const {
      email, password, name, majority, entryYear,
    } = req.body as RegisterRequest;

    const hashedPassword = await bcryptjs.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        majority,
        entryYear: +entryYear,
      },
      select: USER_SHOWN_ATTRIBUTES,
    });

    res.json({ message: 'User berhasil terdaftar', data: newUser });
  } catch (err) {
    next(errorHandler(err));
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new HttpException(400, 'Konten tidak valid', errors.array());
    }

    const { email, password } = req.body as LoginRequest;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      throw new HttpException(404, 'Email tidak ditemukan');
    }

    const isPasswordMatch = await bcryptjs.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordMatch) {
      throw new HttpException(401, 'Password salah');
    }

    const token = jwt.sign({ userId: existingUser.id }, JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({ message: 'Login berhasil', data: { token } });
  } catch (err) {
    next(err);
  }
};

export const getAuthenticatedUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const foundUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: USER_SHOWN_ATTRIBUTES,
    });

    res.json({
      message: 'Profil berhasil didapatkan berdasarkan id',
      data: foundUser,
    });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new HttpException(400, 'Body tidak valid', errors.array());
    }

    const payload = req.body as Prisma.UserUpdateInput;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: payload.name,
        entryYear: payload.entryYear,
        majority: payload.majority,
        isGraduated: payload.isGraduated,
        thesisTitle: payload.thesisTitle,
        thesisURL: payload.thesisURL,
        graduationYear: payload.graduationYear,
      },
      select: USER_SHOWN_ATTRIBUTES,
    });
    res.json({ message: 'User berhasil diupdate', data: updatedUser });
  } catch (err) {
    next(err);
  }
};

export const updateProfileImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { files } = req;

  try {
    if (!files) {
      throw new HttpException(400, 'Tidak ada gambar');
    } else {
      try {
        const { image } = files as { image: fileUpload.UploadedFile };

        const filePath = `users/${image.name}`;

        await storage.from('images').upload(filePath, image.data, {
          cacheControl: '3600',
          upsert: false,
          contentType: image.mimetype,
        });

        const profileImageURL = `${IMAGE_URL_PREFIX}/${filePath}`;

        const blurHash = (await encodeImageToBlurhash(
          profileImageURL,
        )) as string;

        const updatedUser = await prisma.user.update({
          where: { id: req.user.id },
          data: { profileImageURL, blurHash },
          select: USER_SHOWN_ATTRIBUTES,
        });

        res.json({
          message: 'Gambar profil berhasil diperbarui',
          data: updatedUser,
        });
      } catch (err) {
        throw new HttpException(500, 'Failed to upload');
      }
    }
  } catch (err) {
    next(err);
  }
};
