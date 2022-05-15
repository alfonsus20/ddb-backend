import { Router } from "express";
import { body } from "express-validator";
import { getAuthenticatedUser, login, register, updateProfile } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const route = Router();

route.post(
  "/register",
  [
    body("email").notEmpty().isEmail().withMessage("Email tidak valid"),
    body("password")
      .notEmpty()
      .isString()
      .isLength({ min: 8 })
      .withMessage("Panjang password minimal 8 karakter"),
    body("name").notEmpty().isString(),
    body("majority").notEmpty().isString(),
    body("entryYear").notEmpty().isNumeric(),
  ],
  register
);

route.post(
  "/login",
  [
    body("email").notEmpty().isEmail().withMessage("Email tidak valid"),
    body("password").notEmpty().isString(),
  ],
  login
);

route.get("/profile", authMiddleware, getAuthenticatedUser);
route.put("/profile", authMiddleware, updateProfile);


export default route;
