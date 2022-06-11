import bcryptjs from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import fileUpload from 'express-fileupload';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import storage from '../config/storage';
import HttpException from '../exceptions/HttpException';
import { LoginDto, RegisterDto, UpdateUserDto } from '../interfaces/auth.interface';
import { IMAGE_URL_PREFIX, USER_SHOWN_ATTRIBUTES } from '../utils/constants';

import { JWT_SECRET } from '../config/env';
import { ResponseCodes } from '../utils/enums';
import { encodeImageToBlurhash, errorHandler } from '../utils/helpers';
import prisma from '../utils/prisma';

/**
 *  @desc    Register
 *  @route   POST /register
 *  @access  Public
*/
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new HttpException(400, ResponseCodes.BAD_REQUEST, errors.array());
    }

    const {
      email, password, name, majority, entryYear,
    } = req.body as RegisterDto;

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

    res.json({ message: ResponseCodes.SUCCESS, data: newUser });
  } catch (err) {
    next(errorHandler(err));
  }
};

/**
 *  @desc    Login
 *  @route   POST /login
 *  @access  Public
*/
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

    const { email, password } = req.body as LoginDto;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      throw new HttpException(404, ResponseCodes.NOT_FOUND);
    }

    const isPasswordMatch = await bcryptjs.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordMatch) {
      throw new HttpException(401, ResponseCodes.BAD_REQUEST);
    }

    const token = jwt.sign({ userId: existingUser.id }, JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({ message: ResponseCodes.SUCCESS, data: { token } });
  } catch (err) {
    next(err);
  }
};

/**
 *  @desc    Get Profile
 *  @route   GET /profile
 *  @access  Private
*/
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
      message: ResponseCodes.SUCCESS,
      data: foundUser,
    });
  } catch (err) {
    next(err);
  }
};

/**
 *  @desc    Update Profile
 *  @route   PUT /profile
 *  @access  Private
*/
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new HttpException(400, ResponseCodes.BAD_REQUEST, errors.array());
    }

    const payload = req.body as UpdateUserDto;

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
    res.json({ message: ResponseCodes.SUCCESS, data: updatedUser });
  } catch (err) {
    next(err);
  }
};

/**
 *  @desc    Update Profile Image
 *  @route   PUT /profile/profileImage
 *  @access  Public
*/
export const updateProfileImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { files } = req;

  try {
    if (!files) {
      throw new HttpException(400, ResponseCodes.BAD_REQUEST);
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
          message: ResponseCodes.SUCCESS,
          data: updatedUser,
        });
      } catch (err) {
        throw new HttpException(500, ResponseCodes.SERVER_ERROR);
      }
    }
  } catch (err) {
    next(err);
  }
};
