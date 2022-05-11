import { Router } from "express";
import { body } from "express-validator";
import { createArticle } from "../controllers/article.controller";
import {
  adminMiddleware,
  authMiddleware,
} from "../middlewares/auth.middleware";

const route = Router();

route.post(
  "/",
  authMiddleware,
  adminMiddleware,
  [body("title").notEmpty().isString(), body("content").notEmpty().isString()],
  createArticle
);

export default route;
