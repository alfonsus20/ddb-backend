import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import HttpException from '../exceptions/HttpException';
import { UserQuery } from '../interfaces/user.interface';
import { USER_SHOWN_ATTRIBUTES } from '../utils/constants';
import { ResponseCodes } from '../utils/enums';
import { errorHandler } from '../utils/helpers';
import prisma from '../utils/prisma';

export const getAllUsersFilteredAndPaginated = async (
  req: Request<{}, {}, {}, UserQuery>,
  res: Response,
  next: NextFunction,
) => {
  const {
    page = 1,
    rowsPerPage = 10,
    sortDirection = 'asc',
    name = '',
    isGraduated,
  } = req.query;

  const filters: { [key: string]: any } = {
    name: { contains: name },
  };

  if (isGraduated !== undefined) {
    filters.isGraduated = isGraduated;
  }

  try {
    const users = await prisma.user.findMany({
      where: filters,
      orderBy: { name: sortDirection },
      take: rowsPerPage,
      skip: (page - 1) * rowsPerPage,
      select: USER_SHOWN_ATTRIBUTES,
    });

    const totalUsers = await prisma.user.count();

    res.json({
      message: ResponseCodes.SUCCESS,
      data: users,
      totalData: totalUsers,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (
  req: Request<{}, {}, {}, UserQuery>,
  res: Response,
  next: NextFunction,
) => {
  const { isGraduated, isVerified } = req.query;

  const filters: { [key: string]: any } = {};

  if (isGraduated !== undefined) {
    filters.isGraduated = isGraduated;
  }

  if (isVerified !== undefined) {
    filters.isVerified = isVerified;
  }

  try {
    const users = await prisma.user.findMany({
      where: filters,
      select: USER_SHOWN_ATTRIBUTES,
    });

    res.json({
      message: ResponseCodes.SUCCESS,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const foundUser = await prisma.user.findFirst({
      where: { id: +req.params.id },
    });

    if (!foundUser) {
      throw new HttpException(404, ResponseCodes.NOT_FOUND);
    }

    res.json({
      message: ResponseCodes.SUCCESS,
      data: foundUser,
    });
  } catch (err) {
    next(err);
  }
};

export const makeUserAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: +req.params.id },
      data: { isAdmin: true },
      select: USER_SHOWN_ATTRIBUTES,
    });

    res.json({ message: ResponseCodes.SUCCESS, data: updatedUser });
  } catch (err) {
    next(errorHandler(err));
  }
};

export const makeUserVerified = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: +req.params.id },
      data: { isVerified: true },
      select: USER_SHOWN_ATTRIBUTES,
    });

    res.json({ message: ResponseCodes.SUCCESS, data: updatedUser });
  } catch (err) {
    next(errorHandler(err));
  }
};

export const editUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new HttpException(400, ResponseCodes.BAD_REQUEST, errors.array());
    }

    const payload = req.body as Prisma.UserUpdateInput;

    const updatedUser = await prisma.user.update({
      where: { id: +req.params.id },
      data: payload,
      select: USER_SHOWN_ATTRIBUTES,
    });

    res.json({ message: ResponseCodes.SUCCESS, data: updatedUser });
  } catch (err) {
    next(errorHandler(err));
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await prisma.user.delete({ where: { id: +req.params.id } });

    res.json({ message: ResponseCodes.SUCCESS, data: null });
  } catch (err) {
    next(errorHandler(err));
  }
};
