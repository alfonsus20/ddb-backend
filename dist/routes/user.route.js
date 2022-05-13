"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const route = (0, express_1.Router)();
route.get("/", user_controller_1.getAllUsersFilteredAndPaginated);
route.get("/findAll", user_controller_1.getAllUsers);
route.get("/:id", user_controller_1.getUserById);
route.get("/:id/makeAdmin", auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, user_controller_1.makeUserAdmin);
route.get("/:id/verify", auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, user_controller_1.makeUserVerified);
route.put("/:id", auth_middleware_1.authMiddleware, [
    (0, express_validator_1.body)("name").notEmpty().isString(),
    (0, express_validator_1.body)("majority").notEmpty().isString(),
    (0, express_validator_1.body)("entryYear").notEmpty().isNumeric(),
    (0, express_validator_1.body)("graduationYear").optional().isNumeric(),
    (0, express_validator_1.body)("thesisURL").optional().isURL(),
    (0, express_validator_1.body)("profileImageURL").optional().isURL(),
], user_controller_1.updateUser);
route.delete("/:id", auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, user_controller_1.deleteUser);
exports.default = route;
