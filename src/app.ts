import express from "express";
import { PORT } from "./config";
import cors from "cors";
import { connectDatabase } from "./utils/db";
import authRoute from "./routes/auth.route";
import articleRoute from "./routes/article.route";
import errorMiddleware from "./middlewares/error.middleware";

const app = express();

app.use(express.json());

app.use(cors());

connectDatabase();

app.get("/", (req, res) => {
  req.user.name;
  res.json({ message: "Hai" });
});

app.use("/", authRoute);
app.use("/article", articleRoute);

app.use(errorMiddleware);

app.listen(PORT || 3000, () => {
  console.log(`Server started on port ${PORT || 3000}`);
});
