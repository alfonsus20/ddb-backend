import sequelize from "../config/db";
import { HttpException } from "../exceptions/HttpException";

export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Successfully connected to DB");
  } catch (e) {
    throw new HttpException(500, "Database error");
  }
};
