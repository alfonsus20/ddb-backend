"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_controller_1 = require("../controllers/auth.controller");
const route = (0, express_1.Router)();
route.post("/register", [
    (0, express_validator_1.body)("email").notEmpty().isEmail().withMessage("Email tidak valid"),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .isString()
        .isLength({ min: 8 })
        .withMessage("Panjang password minimal 8 karakter"),
    (0, express_validator_1.body)("name").notEmpty().isString(),
    (0, express_validator_1.body)("majority").notEmpty().isString(),
    (0, express_validator_1.body)("entryYear").notEmpty().isNumeric(),
], auth_controller_1.register);
route.post("/login", [
    (0, express_validator_1.body)("email").notEmpty().isEmail().withMessage("Email tidak valid"),
    (0, express_validator_1.body)("password").notEmpty().isString(),
], auth_controller_1.login);
exports.default = route;
