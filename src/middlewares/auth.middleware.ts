import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import HttpException from '../exceptions/HttpException';
import { JWT_SECRET } from '../config';
import { TokenPayload } from '../interfaces/token.interface';
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
      throw new HttpException(401, 'Not authenticated');
    } else {
      [token] = authHeader.split(' ');
    }

    if (!token) {
      throw new HttpException(401, 'Token not found');
    }

    try {
      const { userId } = jwt.verify(token, JWT_SECRET) as TokenPayload;
      const user = await prisma.user.findFirst({ where: { id: userId } });

      if (user) {
        req.user = user;
        next();
      } else {
        throw new HttpException(404, 'User not found');
      }
    } catch (err) {
      throw new HttpException(401, 'Token invalid');
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
    next(new HttpException(403, 'Not authorized as admin'));
  }
};
