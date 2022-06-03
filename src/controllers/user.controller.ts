import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { HttpException } from "../exceptions/HttpException";
import { UserPayload, UserQuery } from "../interfaces/user.interface";
import { prisma } from "../utils/db";

export const getAllUsersFilteredAndPaginated = async (
  req: Request<{}, {}, {}, UserQuery>,
  res: Response,
  next: NextFunction
) => {
  const {
    page = 1,
    rowsPerPage = 10,
    sortDirection = "asc",
    name = "",
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
      select: {
        id: true,
        name: true,
        email: true,
        password: false,
        thesisTitle: true,
        thesisURL: true,
        entryYear: true,
        graduationYear: true,
        majority: true,
        blurHash: true,
        profileImageURL: true,
        isAdmin: true,
        isVerified: true,
        isGraduated: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const totalUsers = await prisma.user.count();

    res.json({
      message: "Semua user berhasil didapatkan (paginated)",
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
  next: NextFunction
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
      select: {
        id: true,
        name: true,
        email: true,
        password: false,
        thesisTitle: true,
        thesisURL: true,
        entryYear: true,
        graduationYear: true,
        majority: true,
        blurHash: true,
        profileImageURL: true,
        isAdmin: true,
        isVerified: true,
        isGraduated: true,
        createdAt: true,
        updatedAt: true,
      },
    });

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
    const foundUser = await prisma.user.findFirst({
      where: { id: +req.params.id },
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

export const makeUserAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const foundUser = await prisma.user.findFirst({
      where: { id: +req.params.id },
    });

    if (!foundUser) {
      throw new HttpException(404, "User tidak ditemukan");
    }

    await prisma.user.update({
      where: { id: +req.params.id },
      data: { isAdmin: true },
    });

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
    const foundUser = await prisma.user.findFirst({
      where: { id: +req.params.id },
    });

    if (!foundUser) {
      throw new HttpException(404, "User tidak ditemukan");
    }

    await prisma.user.update({
      where: { id: +req.params.id },
      data: { isVerified: true },
    });

    res.json({ message: "User berhasil diverifikasi", data: null });
  } catch (err) {
    next(err);
  }
};

export const editUser = async (
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

    const foundUser = await prisma.user.findFirst({
      where: { id: +req.params.id },
    });

    if (!foundUser) {
      throw new HttpException(404, "User tidak ditemukan");
    }

    await prisma.user.update({ where: { id: +req.params.id }, data: payload });

    res.json({ message: "User berhasil diupdate", data: foundUser });
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
    const foundUser = await prisma.user.findFirst({
      where: { id: +req.params.id },
    });

    if (!foundUser) {
      throw new HttpException(404, "User tidak ditemukan");
    }

    await prisma.user.delete({ where: { id: +req.params.id } });

    res.json({ message: "User berhasil dihapus", data: null });
  } catch (err) {
    next(err);
  }
};
