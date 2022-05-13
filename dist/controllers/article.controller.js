"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadArticleImage = exports.deleteArticle = exports.updateArticle = exports.createArticle = exports.getArticleById = exports.getAllArticle = exports.getAllArticleFilteredAndPaginated = void 0;
const express_validator_1 = require("express-validator");
const storage_1 = __importDefault(require("../config/storage"));
const HttpException_1 = require("../exceptions/HttpException");
const article_model_1 = __importDefault(require("../models/article.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const getAllArticleFilteredAndPaginated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 0, rowsPerPage = 10, sortDirection = "DESC" } = req.query;
    try {
        const articles = yield article_model_1.default.findAll({
            include: [{ model: user_model_1.default, as: "user", attributes: ["name"] }],
            offset: page * rowsPerPage,
            limit: rowsPerPage,
            order: [["createdAt", sortDirection]],
        });
        res.json({
            message: "Semua artikel berhasil didapatkan",
            data: articles,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getAllArticleFilteredAndPaginated = getAllArticleFilteredAndPaginated;
const getAllArticle = (_, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articles = yield article_model_1.default.findAll({
            include: [{ model: user_model_1.default, as: "user", attributes: ["name"] }],
        });
        res.json({
            message: "Semua artikel berhasil didapatkan",
            data: articles,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getAllArticle = getAllArticle;
const getArticleById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundArticle = yield article_model_1.default.findOne({
            where: { id: req.params.id },
        });
        if (!foundArticle) {
            throw new HttpException_1.HttpException(404, "Artikel tidak ditemukan");
        }
        res.json({
            message: "Artikel berhasil didapatkan berdasarkan id",
            data: foundArticle,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getArticleById = getArticleById;
const createArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new HttpException_1.HttpException(400, "Body tidak valid", errors.array());
        }
        const payload = req.body;
        const newArticle = yield req.user.createArticle(payload);
        res.json({ message: "Artikel berhasil dibuat", data: newArticle });
    }
    catch (err) {
        next(err);
    }
});
exports.createArticle = createArticle;
const updateArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new HttpException_1.HttpException(400, "Body tidak valid", errors.array());
        }
        const payload = req.body;
        const foundArticle = yield article_model_1.default.findOne({
            where: { id: req.params.id },
        });
        if (!foundArticle) {
            throw new HttpException_1.HttpException(404, "Artikel tidak ditemukan");
        }
        yield foundArticle.update(payload);
        res.json({ message: "Artikel berhasil diupdate", data: foundArticle });
    }
    catch (err) {
        next(err);
    }
});
exports.updateArticle = updateArticle;
const deleteArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundArticle = yield article_model_1.default.findOne({
            where: { id: req.params.id },
        });
        if (!foundArticle) {
            throw new HttpException_1.HttpException(404, "Artikel tidak ditemukan");
        }
        yield foundArticle.destroy();
        res.json({ message: "Artikel berhasil dihapus", data: null });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteArticle = deleteArticle;
const uploadArticleImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { files } = req;
    try {
        if (!files) {
            throw new HttpException_1.HttpException(400, "Tidak ada gambar");
        }
        else {
            try {
                const { image } = files;
                const filePath = `users/${image.name}`;
                yield storage_1.default.from("images").upload(filePath, image.data, {
                    cacheControl: "3600",
                    upsert: false,
                    contentType: image.mimetype,
                });
                res.json({ message: "File berhasil diupload", data: null });
            }
            catch (err) {
                throw new HttpException_1.HttpException(500, "Failed to upload");
            }
        }
    }
    catch (err) {
        next(err);
    }
});
exports.uploadArticleImage = uploadArticleImage;
