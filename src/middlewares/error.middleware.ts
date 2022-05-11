import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions/HttpException";

export default (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(error.status).json({ message: error.message, data: error.data });
};
