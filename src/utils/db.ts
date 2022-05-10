import sequelize from "../config/db";

export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Successfully connected to DB");
  } catch (e) {
    console.log(e);
  }
};
