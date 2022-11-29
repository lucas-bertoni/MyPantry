// All written by Lucas Bertoni

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import * as helper from './helper.js';
import * as dotenv from 'dotenv';
import logger from 'morgan';

dotenv.config({ path: '../../.env' });

const app: Express = express();
const port: number = 4003;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(logger('dev'));

app.post('/logevent', (req: Request, res: Response) => {
  const event: { type: string; data: any} = req.body;
  const ignoredTypes = ['LoginAttempt', 'GetEventLogs', 'GetEventTypes', 'AuthenticateUser'];
  if (!ignoredTypes.includes(event.type)) {
    try {
      if (event.data.password) {
        delete event.data.password;
      }
      helper.logEvent(event);
    } catch (error) {
      console.log('\nThere was an error logging the event');
    }  
  }

  res.send(null);
});

app.get('/getlogs', async (req: Request, res: Response) => {
  try {
    res.send({ events: await helper.getEventLogs() });
    return;
  } catch (error) {
    console.log('\nThere was an error getting the event logs');
  }

  res.send(null);
});

app.get('/gettypes', async (req: Request, res: Response) => {
  try {
    res.send({ eventTypes: await helper.getEventTypes() });
    return;
  } catch (error) {
    console.log('\nThere was an error getting the event types');
  }

  res.send(null);
});

app.listen(port, () => {
  console.log(`Event logger listening on ${port}`);
})