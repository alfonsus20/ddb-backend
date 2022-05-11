import express from "express";
import { PORT } from "./config";
import cors from "cors";
import { connectDatabase } from "./utils/db";
import User from "./models/user";

const app = express();

app.use(express.json());

app.use(cors());

connectDatabase();

app.get("/", (req, res) => {
  req.user.name;
  res.json({ message: "Hai" });
});

app.post("/halo", async (req, res) => {
  try {
    const newUser = await User.create({
      name: "James",
      email: "james@gmail.com",
      password: "password",
      entryYear: 2020,
      majority: "Informatika",
    });
    const article = await newUser.createArticle({
      title: "Halo DDB",
      content: "test",
    });
    res.json({ message: "mantap", user: newUser, article });
  } catch (e) {
    console.log(e);
  }
});

app.listen(PORT || 3000, () => {
  console.log(`Server started on port ${PORT || 3000}`);
});
