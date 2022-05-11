import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions/HttpException";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { TokenPayload } from "../interfaces/token.interface";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    throw new HttpException(401, "Not authenticated");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new HttpException(401, "Token not found");
  }

  try {
    const { user } = jwt.verify(token, JWT_SECRET) as TokenPayload;
    req.user = user;
    next();
  } catch (err) {
    res.status(400);
    throw new Error("Token invalid");
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
    throw new HttpException(403, "Not authorized as admin");
  }
};
