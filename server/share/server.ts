// All written by Lucas Bertoni

import express, { Express, Request, Response } from 'express';
import * as helper from './helper.js';
import cors from 'cors';
import axios, { AxiosError } from 'axios';
import morgan from 'morgan';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const app: Express = express();
const port: number = 4009;

app.use(morgan('dev'));
app.use(cors());


app.get('/getrecipe', async (req: Request, res: Response) => {
  const recipe_id = req.body.recipe_id;

  if (!recipe_id) {
    res.status(400).send('Recipe ID Required');
    return;
  }

  const recipe = await helper.getRecipe(recipe_id);

  if (!recipe) {
    res.status(400).send('Recipe doesn\'t exist');
    return;
  }

  res.status(200).send(recipe);
});


app.listen(port, () => {
  console.log(`Authentication listening on ${port}`);
})