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
exports.adminMiddleware = exports.authMiddleware = void 0;
const HttpException_1 = require("../exceptions/HttpException");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const user_model_1 = __importDefault(require("../models/user.model"));
const authMiddleware = (req, _, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.get("Authorization");
        let token = "";
        if (!authHeader) {
            throw new HttpException_1.HttpException(401, "Not authenticated");
        }
        else {
            token = authHeader.split(" ")[1];
        }
        if (!token) {
            throw new HttpException_1.HttpException(401, "Token not found");
        }
        try {
            const { userId } = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
            const user = yield user_model_1.default.findOne({ where: { id: userId } });
            if (user) {
                req.user = user;
                next();
            }
            else {
                throw new HttpException_1.HttpException(404, "User not found");
            }
        }
        catch (err) {
            throw new HttpException_1.HttpException(401, "Token invalid");
        }
    }
    catch (err) {
        next(err);
    }
});
exports.authMiddleware = authMiddleware;
const adminMiddleware = (req, _, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user && req.user.isAdmin) {
        next();
    }
    else {
        next(new HttpException_1.HttpException(403, "Not authorized as admin"));
    }
});
exports.adminMiddleware = adminMiddleware;
