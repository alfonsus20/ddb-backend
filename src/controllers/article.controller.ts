import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { HttpException } from "../exceptions/HttpException";
import { ArticlePayload } from "../interfaces/article.interface";

export const createArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new HttpException(400, "Body tidak valid", errors.array());
    }

    const payload = req.body as ArticlePayload;
    const newArticle = await req.user.createArticle(payload);
    
    res.json({ message: "Artikel berhasil dibuat", data: newArticle });
  } catch (err) {
    next(err);
  }
};
