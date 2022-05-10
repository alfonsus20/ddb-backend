import express from "express";
import { PORT } from "./config";
import cors from 'cors';

const app = express();

app.use(express.json());

app.use(cors());

app.get('/', (req, res)=>{
  res.json({message : "Hai"})
})

app.listen(PORT || 3000, () => {
  console.log(`Server started on port ${PORT || 3000}`);
});
