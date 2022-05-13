"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const _1 = require("./");
const sequelize = new sequelize_1.default.Sequelize(_1.DB_NAME, _1.DB_USER, _1.DB_PASSWORD, {
    dialect: "postgres",
    host: _1.DB_HOST,
    port: Number(_1.DB_PORT),
});
exports.default = sequelize;
