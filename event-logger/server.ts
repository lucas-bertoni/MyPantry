// All written by Lucas Bertoni

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import * as helper from './helper.js';
import * as dotenv from 'dotenv';
import logger from 'morgan';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { Event } from './event_types';
import EventBusInterface from '../EventBusInterface';

dotenv.config({ path: '../.env' });

const app: Express = express();
const port: any = process.env.EVENTLOGGER_PORT || 4002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(logger('dev'));

app.post('/events', async (req: Request, res: Response) => {
  const event: Event = req.body;

  if (!event.type) {
    res.status(400).send('Event type required');
    return;
  }

  const ignoredTypes: string[] = [];
  if (!ignoredTypes.includes(event.type)) {
    try {
      if (event.data.password) {
        delete event.data.password;
      }

      await helper.logEvent(event);

      res.status(201).send('Event logged');
    } catch (error) {
      console.log('\nThere was an error logging the event');
      res.status(500).send('There was an error logging the event');
    }  
  }
});

app.get('/getlogs', async (req: Request, res: Response) => {
  try {
    res.status(200).send({ events: await helper.getEventLogs() });
  } catch (error) {
    console.log('\nThere was an error getting the event logs');
    res.status(500).send('There was an error getting the event logs');
  }
});

app.get('/gettypes', async (req: Request, res: Response) => {
  try {
    res.status(200).send({ eventTypes: await helper.getEventTypes() });
  } catch (error) {
    console.log('\nThere was an error getting the event types');
    res.status(500).send('There was an error getting the event types');
  }
});

app.listen(port, async () => {
  console.log(`Event logger listening on ${port}`);

  const ebif = new EventBusInterface('eventlogger', port);

  await ebif.register();
  await ebif.subscribe(['UserCreated', 'LoginSuccess', 'IngredientCreated', 'RecipeCreated', 'ShareRecipe']);
})