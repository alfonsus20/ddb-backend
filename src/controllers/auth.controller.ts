import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { HttpException } from "../exceptions/HttpException";
import User from "../models/user.model";
import { LoginRequest, RegisterRequest } from "../interfaces/auth.interface";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

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

    const { email, password, ...rest } = req.body as RegisterRequest;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new HttpException(400, "Email telah digunakan");
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      ...rest,
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
      expiresIn: "2h",
    });

    res.json({ message: "Login berhasil", data: { token } });
  } catch (err) {
    next(err);
  }
};
