import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { PORT } from './config';
import authRoute from './routes/auth.route';
import articleRoute from './routes/article.route';
import userRoute from './routes/user.route';
import errorMiddleware from './middlewares/error.middleware';

const app = express();

app.use(express.json());
app.use(cors());
app.use(fileUpload());

app.get('/', (_, res) => {
  res.json({ message: 'DDB Official Backend API' });
});

app.use('/', authRoute);
app.use('/articles', articleRoute);
app.use('/users', userRoute);

app.use(errorMiddleware);

app.listen(PORT || 3000, () => {
  console.log(`Server started on port ${PORT || 3000}`);
});
