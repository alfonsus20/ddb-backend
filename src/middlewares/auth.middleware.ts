import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';
import HttpException from '../exceptions/HttpException';
import { TokenPayload } from '../interfaces/token.interface';
import { ResponseCodes } from '../utils/enums';
import prisma from '../utils/prisma';

export const authMiddleware = async (
  req: Request,
  _: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.get('Authorization');

    let token = '';

    if (!authHeader) {
      throw new HttpException(401, ResponseCodes.UNAUTHENTICATED);
    } else {
      [,token] = authHeader.split(' ');
    }

    if (!token) {
      throw new HttpException(401, ResponseCodes.BAD_REQUEST);
    }

    try {
      const { userId } = jwt.verify(token, JWT_SECRET) as TokenPayload;
      const user = await prisma.user.findFirst({ where: { id: userId } });

      if (user) {
        req.user = user;
        next();
      } else {
        next(new HttpException(404, ResponseCodes.NOT_FOUND));
      }
    } catch (err) {
      throw new HttpException(401, ResponseCodes.BAD_REQUEST);
    }
  } catch (err) {
    next(err);
  }
};

export const adminMiddleware = async (
  req: Request,
  _: Response,
  next: NextFunction,
) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    next(new HttpException(403, ResponseCodes.UNAUTHORIZED));
  }
};
