"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const article_controller_1 = require("../controllers/article.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const route = (0, express_1.Router)();
route.get("/", article_controller_1.getAllArticleFilteredAndPaginated);
route.get("/findAll", article_controller_1.getAllArticle);
route.get("/:id", article_controller_1.getArticleById);
route.post("/", auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, [
    (0, express_validator_1.body)("title").notEmpty().isString(),
    (0, express_validator_1.body)("content").notEmpty().isString(),
    (0, express_validator_1.body)("imageURL").notEmpty().isString(),
], article_controller_1.createArticle);
route.post("/", auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, [
    (0, express_validator_1.body)("title").notEmpty().isString(),
    (0, express_validator_1.body)("content").notEmpty().isString(),
    (0, express_validator_1.body)("imageURL").notEmpty().isString(),
], article_controller_1.createArticle);
route.put("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, [
    (0, express_validator_1.body)("title").notEmpty().isString(),
    (0, express_validator_1.body)("content").notEmpty().isString(),
    (0, express_validator_1.body)("imageURL").notEmpty().isString(),
], article_controller_1.updateArticle);
route.post("/imageUpload", auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, article_controller_1.uploadArticleImage);
route.delete("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, article_controller_1.deleteArticle);
exports.default = route;
