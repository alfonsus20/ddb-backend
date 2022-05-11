import { Request, Response } from "express";
import { HttpException } from "../exceptions/HttpException";
import { ArticlePayload } from "../interfaces/article.interface";

export const createArticle = async (req: Request, res: Response) => {
  try {
    const payload = req.body as ArticlePayload;
    const newArticle = await req.user.createArticle(payload);
    res.json({ message: "Artikel berhasil dibuat", data: newArticle });
  } catch (err) {
    throw new HttpException(500, "Server error");
  }
};
