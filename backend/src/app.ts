import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import dotenv from 'dotenv';
import indexRouter from './routes/index'

dotenv.config();

const app = express();

export function corsOptions(clientPort: Number) {
  const corsOptions = {
    origin: `http://localhost:${clientPort}`,
    credentials: true
  }
}
app.use(cors());
app.use(json());

app.use('/', indexRouter);

app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;
