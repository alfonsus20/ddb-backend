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
exports.login = exports.register = void 0;
const express_validator_1 = require("express-validator");
const HttpException_1 = require("../exceptions/HttpException");
const user_model_1 = __importDefault(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new HttpException_1.HttpException(400, "Konten tidak valid", errors.array());
        }
        const { email, password, name, majority, entryYear } = req.body;
        const existingUser = yield user_model_1.default.findOne({ where: { email } });
        if (existingUser) {
            throw new HttpException_1.HttpException(400, "Email telah digunakan");
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
        const newUser = yield user_model_1.default.create({
            name,
            email,
            password: hashedPassword,
            majority,
            entryYear,
        });
        res.json({ message: "User berhasil terdaftar", data: newUser });
    }
    catch (err) {
        next(err);
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new HttpException_1.HttpException(400, "Konten tidak valid", errors.array());
        }
        const { email, password } = req.body;
        const existingUser = yield user_model_1.default.findOne({ where: { email } });
        if (!existingUser) {
            throw new HttpException_1.HttpException(404, "Email tidak ditemukan");
        }
        const isPasswordMatch = yield bcryptjs_1.default.compare(password, existingUser.password);
        if (!isPasswordMatch) {
            throw new HttpException_1.HttpException(401, "Password salah");
        }
        const token = jsonwebtoken_1.default.sign({ userId: existingUser.id }, config_1.JWT_SECRET, {
            expiresIn: "2h",
        });
        res.json({ message: "Login berhasil", data: { token } });
    }
    catch (err) {
        next(err);
    }
});
exports.login = login;
