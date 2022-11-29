// All written by Lucas Bertoni

import express, { Express, Request, Response } from 'express';
import axios, { AxiosError } from 'axios';
import cors from 'cors';
import * as dotenv from 'dotenv';
import logger from 'morgan';

dotenv.config({ path: '../../.env' });

const app: Express = express();
const port: number = 4002;

app.use(express.json());
app.use(cors());
app.use(logger('dev'));

app.post('/events', async (req: Request, res: Response) => {
  const { type, data }: {type: string; data: any} = req.body;

  const url = process.env.NODE_ENV === 'production' ?
    'http://eventlogger:4003/logevent' :
    'http://localhost:4003/logevent';
  
  await axios.post(url, req.body)
    .catch( (axiosError: AxiosError) => {
      console.log('Event log failed');
      console.log(axiosError);
      return;
    });

  res.status(200).send(null);
});


app.listen(port, () => {
  console.log(`Event Bus listening on port ${port}`);
});