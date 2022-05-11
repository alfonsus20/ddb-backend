import { NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import { validationResult } from "express-validator";
import storage from "../config/storage";
import { HttpException } from "../exceptions/HttpException";
import { ArticlePayload } from "../interfaces/article.interface";
import { CommonQuery } from "../interfaces/index.interface";
import Article from "../models/article.model";
import User from "../models/user.model";

export const getAllArticleFilteredAndPaginated = async (
  req: Request<{}, {}, {}, CommonQuery>,
  res: Response,
  next: NextFunction
) => {
  const { page = 0, rowsPerPage = 10, sortDirection = "DESC" } = req.query;

  try {
    const articles = await Article.findAll({
      include: [{ model: User, as: "user", attributes: ["name"] }],
      offset: page * rowsPerPage,
      limit: rowsPerPage,
      order: [["createdAt", sortDirection]],
    });

    res.json({
      message: "Semua artikel berhasil didapatkan",
      data: articles,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllArticle = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const articles = await Article.findAll({
      include: [{ model: User, as: "user", attributes: ["name"] }],
    });

    res.json({
      message: "Semua artikel berhasil didapatkan",
      data: articles,
    });
  } catch (err) {
    next(err);
  }
};

export const getArticleById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const foundArticle = await Article.findOne({
      where: { id: req.params.id },
    });

    if (!foundArticle) {
      throw new HttpException(404, "Artikel tidak ditemukan");
    }

    res.json({
      message: "Artikel berhasil didapatkan berdasarkan id",
      data: foundArticle,
    });
  } catch (err) {
    next(err);
  }
};

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

export const updateArticle = async (
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
    const foundArticle = await Article.findOne({
      where: { id: req.params.id },
    });

    if (!foundArticle) {
      throw new HttpException(404, "Artikel tidak ditemukan");
    }

    await foundArticle.update(payload);
    res.json({ message: "Artikel berhasil diupdate", data: foundArticle });
  } catch (err) {
    next(err);
  }
};

export const deleteArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const foundArticle = await Article.findOne({
      where: { id: req.params.id },
    });

    if (!foundArticle) {
      throw new HttpException(404, "Artikel tidak ditemukan");
    }

    await foundArticle.destroy();
    res.json({ message: "Artikel berhasil dihapus", data: null });
  } catch (err) {
    next(err);
  }
};

export const uploadArticleImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { files } = req;

  try {
    if (!files) {
      throw new HttpException(400, "Tidak ada gambar");
    } else {
      try {
        const { image } = files as { image: fileUpload.UploadedFile };

        const filePath = `users/${image.name}`;

        await storage.from("images").upload(filePath, image.data, {
          cacheControl: "3600",
          upsert: false,
          contentType: image.mimetype,
        });

        res.json({ message: "File berhasil diupload", data: null });
      } catch (err) {
        throw new HttpException(500, "Failed to upload");
      }
    }
  } catch (err) {
    next(err);
  }
};
