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
exports.deleteUser = exports.makeUserVerified = exports.makeUserAdmin = exports.updateUser = exports.getUserById = exports.getAllUsers = exports.getAllUsersFilteredAndPaginated = void 0;
const express_validator_1 = require("express-validator");
const HttpException_1 = require("../exceptions/HttpException");
const user_model_1 = __importDefault(require("../models/user.model"));
const sequelize_1 = require("sequelize");
const getAllUsersFilteredAndPaginated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 0, rowsPerPage = 10, sortDirection = "ASC", name = "", } = req.query;
    try {
        const users = yield user_model_1.default.findAll({
            offset: page * rowsPerPage,
            limit: rowsPerPage,
            order: [["name", sortDirection]],
            where: { name: { [sequelize_1.Op.iLike]: `%${name.toLowerCase()}%` } },
        });
        res.json({
            message: "Semua user berhasil didapatkan (paginated)",
            data: users,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getAllUsersFilteredAndPaginated = getAllUsersFilteredAndPaginated;
const getAllUsers = (_, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.findAll();
        res.json({
            message: "Semua user berhasil didapatkan",
            data: users,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getAllUsers = getAllUsers;
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundUser = yield user_model_1.default.findOne({
            where: { id: req.params.id },
        });
        if (!foundUser) {
            throw new HttpException_1.HttpException(404, "User tidak ditemukan");
        }
        res.json({
            message: "User berhasil didapatkan berdasarkan id",
            data: foundUser,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getUserById = getUserById;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new HttpException_1.HttpException(400, "Body tidak valid", errors.array());
        }
        const payload = req.body;
        delete payload.isAdmin;
        delete payload.isVerified;
        const foundUser = yield user_model_1.default.findOne({
            where: { id: req.params.id },
        });
        if (!foundUser) {
            throw new HttpException_1.HttpException(404, "User tidak ditemukan");
        }
        if (foundUser.id == req.user.id || req.user.isAdmin) {
            yield foundUser.update(payload);
            res.json({ message: "User berhasil diupdate", data: foundUser });
        }
        else {
            throw new HttpException_1.HttpException(403, "Forbidden");
        }
    }
    catch (err) {
        next(err);
    }
});
exports.updateUser = updateUser;
const makeUserAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundUser = yield user_model_1.default.findOne({
            where: { id: req.params.id },
        });
        if (!foundUser) {
            throw new HttpException_1.HttpException(404, "User tidak ditemukan");
        }
        yield foundUser.update({ isAdmin: true });
        res.json({ message: "User berhasil dijadikan admin", data: null });
    }
    catch (err) {
        next(err);
    }
});
exports.makeUserAdmin = makeUserAdmin;
const makeUserVerified = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundUser = yield user_model_1.default.findOne({
            where: { id: req.params.id },
        });
        if (!foundUser) {
            throw new HttpException_1.HttpException(404, "User tidak ditemukan");
        }
        yield foundUser.update({ isVerified: true });
        res.json({ message: "User berhasil diverifikasi", data: null });
    }
    catch (err) {
        next(err);
    }
});
exports.makeUserVerified = makeUserVerified;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundUser = yield user_model_1.default.findOne({
            where: { id: req.params.id },
        });
        if (!foundUser) {
            throw new HttpException_1.HttpException(404, "User tidak ditemukan");
        }
        yield foundUser.destroy();
        res.json({ message: "User berhasil dihapus", data: null });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteUser = deleteUser;
