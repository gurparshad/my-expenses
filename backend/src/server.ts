import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import expensesRouter from './expenses/routes';
dotenv.config();

const app = express();
const port = process.env.PORT;
app.use(helmet());
app.use(bodyParser.json());

const corsOptions = {
  origin: process.env.CLIENT_APP_URL,
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use('/expenses', expensesRouter);

app.get('/', (req, res) => {
  res.send('express api');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
