// All written by Lucas Bertoni

import express, { Express, Request, Response } from 'express';
import axios, { AxiosError } from 'axios';
import cors from 'cors';
import * as dotenv from 'dotenv';
import logger from 'morgan';

dotenv.config({ path: '../.env' });

const app: Express = express();
const port: any = process.env.EVENTBUS_PORT || 4000;

app.use(express.json());
app.use(cors());
app.use(logger('dev'));

const logEvent = async (event: Event) => {
  const url = process.env.NODE_ENV === 'production'
    ? 'http://eventlogger:' + process.env.EVENTLOGGER_PORT + '/logevent'
    : 'http://localhost:' + process.env.EVENTLOGGER_PORT + '/logevent';
  
  await axios.post(url, event)
    .catch( (axiosError: AxiosError) => {
      console.log('Event log failed');
      console.log(axiosError);
      return;
    });
}

app.post('/events', async (req: Request, res: Response) => {
  const event: Event = req.body;

  try {
    await logEvent(event);
  } catch (error) {
    console.log('There was an error logging the event');
    console.log(error);
  }

  if (event.type === 'IngredientCreated' || event.type === 'RecipeCreated') {
    try {
      const url = process.env.NODE_ENV === 'production'
        ? 'http://share:' + process.env.SHARE_PORT + '/events'
        : 'http://localhost:' + process.env.SHARE_PORT + '/events';

      await axios.post(url, event);
    } catch (error) {
      console.log('There was an error sending the event to the share service');
      console.log(error);
    }
  }

  if (event.type === 'UserCreated') {
    // Send stuff to pantry service
  }

  // Put more stuff here

  res.status(200).send(null);
});


app.listen(port, () => {
  console.log(`Event Bus listening on port ${port}`);
});