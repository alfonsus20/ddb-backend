import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions/HttpException";

export default (error: HttpException, _: Request, res: Response, next:NextFunction) => {
  const statusCode = error.status || 500;
  res.status(statusCode).json({ message: error.message, data: error.data });
};
