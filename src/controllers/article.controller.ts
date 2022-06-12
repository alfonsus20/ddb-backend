import { NextFunction, Request, Response } from 'express';
import fileUpload from 'express-fileupload';
import { validationResult } from 'express-validator';
import storage from '../config/storage';
import HttpException from '../exceptions/HttpException';
import { CreateArticleDto, UpdateArticleDto } from '../interfaces/article.interface';
import { CommonQuery } from '../interfaces/common.interface';
import { IMAGE_URL_PREFIX } from '../utils/constants';
import { ResponseCodes } from '../utils/enums';
import { encodeImageToBlurhash, errorHandler } from '../utils/helpers';
import prisma from '../utils/prisma';

/**
 *  @desc    Get All Articles with Filter, Sorting, and Pagination Capability
 *  @route   GET /articles
 *  @access  Public
*/
export const getAllArticleFilteredAndPaginated = async (
  req: Request<{}, {}, {}, CommonQuery>,
  res: Response,
  next: NextFunction,
) => {
  const { page = '1', rowsPerPage = '10', sortDirection = 'desc' } = req.query;

  try {
    const articles = await prisma.article.findMany({
      include: { user: { select: { name: true } } },
      take: +rowsPerPage,
      skip: (+page - 1) * +rowsPerPage,
      orderBy: { createdAt: sortDirection },
    });

    const total = await prisma.article.count();

    res.json({
      message: ResponseCodes.SUCCESS,
      data: articles,
      totalData: total,
    });
  } catch (err) {
    next(err);
  }
};

/**
 *  @desc    Get All Articles
 *  @route   GET /articles/findAll
 *  @access  Public
*/
export const getAllArticle = async (
  _: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const articles = await prisma.article.findMany({
      include: { user: { select: { name: true } } },
    });

    res.json({
      message: ResponseCodes.SUCCESS,
      data: articles,
    });
  } catch (err) {
    next(err);
  }
};

/**
 *  @desc    Get Single Article by Id
 *  @route   GET /articles/:id
 *  @access  Public
*/
export const getArticleById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const foundArticle = await prisma.article.findUnique({
      where: { id: +req.params.id },
      include: { user: { select: { name: true } } },
    });

    if (!foundArticle) {
      throw new HttpException(404, ResponseCodes.NOT_FOUND);
    }

    res.json({
      message: ResponseCodes.SUCCESS,
      data: foundArticle,
    });
  } catch (err) {
    next(err);
  }
};

/**
 *  @desc    Create an Article
 *  @route   POST /articles
 *  @access  Private/Admin
*/
export const createArticle = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new HttpException(400, ResponseCodes.BAD_REQUEST, errors.array());
    }

    const payload = req.body as CreateArticleDto;
    payload.blurHash = (await encodeImageToBlurhash(
      payload.imageURL,
    )) as string;

    const newArticle = await prisma.article.create({
      data: {
        ...payload,
        userId: req.user.id,
      },
    });

    res.json({ message: ResponseCodes.SUCCESS, data: newArticle });
  } catch (err) {
    next(err);
  }
};

/**
 *  @desc    Update an Article
 *  @route   PUT /articles/:id
 *  @access  Private/Admin
*/
export const updateArticle = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new HttpException(400, ResponseCodes.BAD_REQUEST, errors.array());
    }

    const payload = req.body as UpdateArticleDto;
    payload.blurHash = (await encodeImageToBlurhash(
      payload.imageURL as string,
    )) as string;

    const updatedArticle = await prisma.article.update({
      data: payload,
      where: { id: +req.params.id },
    });
    res.json({ message: ResponseCodes.SUCCESS, data: updatedArticle });
  } catch (err) {
    next(errorHandler(err));
  }
};

/**
 *  @desc    Delete an Article
 *  @route   DELETE /articles/:id
 *  @access  Private/Admin
*/
export const deleteArticle = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await prisma.article.delete({ where: { id: +req.params.id } });
    res.json({ message: ResponseCodes.SUCCESS, data: null });
  } catch (err) {
    next(errorHandler(err));
  }
};

/**
 *  @desc    Upload Image for an Article
 *  @route   POST /articles/imageUpload
 *  @access  Private/Admin
*/
export const uploadArticleImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { files } = req;

  try {
    if (!files) {
      throw new HttpException(400, ResponseCodes.BAD_REQUEST);
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
          message: ResponseCodes.SUCCESS,
          data: `${IMAGE_URL_PREFIX}/${filePath}`,
        });
      } catch (err) {
        throw new HttpException(500, ResponseCodes.SERVER_ERROR);
      }
    }
  } catch (err) {
    next(err);
  }
};
