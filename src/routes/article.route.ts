import { Router } from "express";
import { body } from "express-validator";
import {
  createArticle,
  deleteArticle,
  getAllArticle,
  getAllArticleFilteredAndPaginated,
  getArticleById,
  updateArticle,
} from "../controllers/article.controller";
import {
  adminMiddleware,
  authMiddleware,
} from "../middlewares/auth.middleware";

const route = Router();

route.get("/", getAllArticleFilteredAndPaginated);

route.get("/findAll", getAllArticle);

route.get("/:id", getArticleById);

route.post(
  "/",
  authMiddleware,
  adminMiddleware,
  [body("title").notEmpty().isString(), body("content").notEmpty().isString()],
  createArticle
);

route.post(
  "/",
  authMiddleware,
  adminMiddleware,
  [body("title").notEmpty().isString(), body("content").notEmpty().isString()],
  createArticle
);

route.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  [body("title").notEmpty().isString(), body("content").notEmpty().isString()],
  updateArticle
);

route.delete("/:id", authMiddleware, adminMiddleware, deleteArticle);

export default route;
