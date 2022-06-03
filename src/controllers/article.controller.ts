import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import fileUpload from 'express-fileupload';
import { validationResult } from 'express-validator';
import { storage } from '../config';
import HttpException from '../exceptions/HttpException';
import { CommonQuery } from '../interfaces/common.interface';
import { IMAGE_URL_PREFIX } from '../utils/constants';
import prisma from '../utils/prisma';
import { encodeImageToBlurhash } from '../utils/helpers';

export const getAllArticleFilteredAndPaginated = async (
  req: Request<{}, {}, {}, CommonQuery>,
  res: Response,
  next: NextFunction,
) => {
  const { page = 1, rowsPerPage = 10, sortDirection = 'desc' } = req.query;

  try {
    const articles = await prisma.article.findMany({
      include: {
        user: true,
      },
      take: rowsPerPage,
      skip: (page - 1) * rowsPerPage,
      orderBy: { createdAt: sortDirection },
    });

    const total = await prisma.article.count();

    res.json({
      message: 'Semua artikel berhasil didapatkan',
      data: articles,
      totalData: total,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllArticle = async (
  _: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const articles = await prisma.article.findMany({
      include: { user: true },
    });

    res.json({
      message: 'Semua artikel berhasil didapatkan',
      data: articles,
    });
  } catch (err) {
    next(err);
  }
};

export const getArticleById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const foundArticle = await prisma.article.findUnique({
      where: { id: +req.params.id },
    });

    if (!foundArticle) {
      throw new HttpException(404, 'Artikel tidak ditemukan');
    }

    res.json({
      message: 'Artikel berhasil didapatkan berdasarkan id',
      data: foundArticle,
    });
  } catch (err) {
    next(err);
  }
};

export const createArticle = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new HttpException(400, 'Body tidak valid', errors.array());
    }

    const payload = req.body as Prisma.ArticleUncheckedCreateInput;
    payload.blurHash = (await encodeImageToBlurhash(
      payload.imageURL,
    )) as string;

    const newArticle = await prisma.article.create({
      data: {
        ...payload,
        userId: req.user.id,
      },
    });

    res.json({ message: 'Artikel berhasil dibuat', data: newArticle });
  } catch (err) {
    next(err);
  }
};

export const updateArticle = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new HttpException(400, 'Body tidak valid', errors.array());
    }

    const payload = req.body as Prisma.ArticleUpdateInput;
    const foundArticle = await prisma.article.findUnique({
      where: { id: +req.params.id },
    });

    if (!foundArticle) {
      throw new HttpException(404, 'Artikel tidak ditemukan');
    }

    payload.blurHash = (await encodeImageToBlurhash(
      payload.imageURL as string,
    )) as string;

    await prisma.article.update({
      data: payload,
      where: { id: +req.params.id },
    });
    res.json({ message: 'Artikel berhasil diupdate', data: foundArticle });
  } catch (err) {
    next(err);
  }
};

export const deleteArticle = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const foundArticle = await prisma.article.findUnique({
      where: { id: +req.params.id },
    });

    if (!foundArticle) {
      throw new HttpException(404, 'Artikel tidak ditemukan');
    }

    await prisma.article.delete({ where: { id: +req.params.id } });
    res.json({ message: 'Artikel berhasil dihapus', data: null });
  } catch (err) {
    next(err);
  }
};

export const uploadArticleImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { files } = req;

  try {
    if (!files) {
      throw new HttpException(400, 'Tidak ada gambar');
    } else {
      try {
        const { image } = files as { image: fileUpload.UploadedFile };

        const filePath = `articles/${image.name}`;

        await storage.from('images').upload(filePath, image.data, {
          cacheControl: '3600',
          upsert: false,
          contentType: image.mimetype,
        });

        res.json({
          message: 'File berhasil diupload',
          data: `${IMAGE_URL_PREFIX}/${filePath}`,
        });
      } catch (err) {
        throw new HttpException(500, 'Failed to upload');
      }
    }
  } catch (err) {
    next(err);
  }
};
