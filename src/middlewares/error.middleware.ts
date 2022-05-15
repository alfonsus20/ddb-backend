import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions/HttpException";

export default (
  error: HttpException,
  _1: Request,
  res: Response,
  _2: NextFunction
) => {
  const statusCode = error.status || 500;
  res.status(statusCode).json({ message: error.message, data: error.data });
};
