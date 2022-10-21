import dotenv from 'dotenv';
import express, { Express } from "express";
import { rateLimit } from 'express-rate-limit';
import cors from "cors";
dotenv.config()

import * as routes from './routes'

const app: Express = express()


// express server config
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(rateLimit({
  windowMs: 10000,
  max: 200,
  message: "Too many requests from this IP, please try again"
}))

app.use('/example', routes.exampleRoute)

app.get('/testGet', (_, res) => {
  res.status(200).send('Get success')
})

const PORT = process.env.PORT || 8083;
console.timeEnd('Server started');

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} : run on ${process.env.NODE_ENV} server`);
})

export default app;