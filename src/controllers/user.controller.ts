import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { HttpException } from "../exceptions/HttpException";
import { UserPayload, UserQuery } from "../interfaces/user.interface";
import User from "../models/user.model";
import { Op } from "sequelize";

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
      console.log(errors.mapped());
      throw new HttpException(400, "Body tidak valid", errors.array());
    }

    const payload = req.body as UserPayload;
    delete payload.isAdmin;

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
