import { Router } from "express";
import { body } from "express-validator";
import { register } from "../controllers/auth.controller";

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

export default route;
