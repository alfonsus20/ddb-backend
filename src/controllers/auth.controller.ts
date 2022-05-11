import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { HttpException } from "../exceptions/HttpException";
import User from "../models/user.model";
import { RegisterRequest } from "../interfaces/auth.interface";
import bcryptjs from "bcryptjs";

export const register = async (req: Request, res: Response) => {
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
    throw new HttpException(500, "Server error");
  }
};
