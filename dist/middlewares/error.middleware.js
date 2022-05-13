"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (error, _, res) => {
    const statusCode = error.status || 500;
    res.status(statusCode).json({ message: error.message, data: error.data });
};
