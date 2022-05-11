import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions/HttpException";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { TokenPayload } from "../interfaces/token.interface";
import User from "../models/user.model";

export const authMiddleware = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const authHeader = req.get("Authorization");

  let token = "";

  if (!authHeader) {
    next(new HttpException(401, "Not authenticated"));
  } else {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    next(new HttpException(401, "Token not found"));
  }

  try {
    const { userId } = jwt.verify(token, JWT_SECRET) as TokenPayload;
    const user = await User.findOne({ where: { id: userId } });

    if (user) {
      req.user = user;
      next();
    } else {
      next(new HttpException(404, "User not found"));
    }
  } catch (err) {
    next(new HttpException(401, "Token invalid"));
  }
};

export const adminMiddleware = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    next(new HttpException(403, "Not authorized as admin"));
  }
};
