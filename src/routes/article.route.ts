import { Router } from "express";
import { createArticle } from "../controllers/article.controller";
import {
  adminMiddleware,
  authMiddleware,
} from "../middlewares/auth.middleware";

const route = Router();

route.post("/", authMiddleware, adminMiddleware, createArticle);

export default route;
