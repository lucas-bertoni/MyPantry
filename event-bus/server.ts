// All written by Lucas Bertoni

interface Register {
  service_name: string;
  service_port: string;
};

interface Publish {
  event_type: string;
};

interface Subscribe {
  event_type: string;
  service_name: string;
  service_port: string;
};

interface Event {
  type: string;
  data: any;
};

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import logger from 'morgan';
import EventBus from './event_bus'

dotenv.config({ path: '../.env' });

const app: Express = express();
const port: any = process.env.EVENTBUS_PORT || 4000;

app.use(express.json());
app.use(cors());
app.use(logger('dev'));

const eb = new EventBus();

app.post('/register', (req: Request, res: Response) => {
  const { service_name, service_port }: Register = req.body;

  if (!service_name || !service_port) {
    res.status(400).send('Service name and port required');
    return;
  }

  try {
    const result = eb.register(service_name.toLowerCase(), service_port);

    if (result.success) {
      res.status(201).send(`The \'${service_name}:${service_port}\' service was successfully registered with the event bus`);
    } else {
      res.status(405).send(`The \'${service_name}:${service_port}\' service could not be registered because ` + result.message.toLowerCase());
    }
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});



app.post('/publish', (req: Request, res: Response) => {
  const { event_type }: Publish = req.body;

  if (!event_type) {
    res.status(400).send('Event type required');
    return;
  }
  
  try {
    const result = eb.publish(event_type);

    if (result.success) {
      res.status(201).send(`The \'${event_type}\' event was successfully published to the event bus`);
    } else {
      res.status(405).send(`The \'${event_type}\' event was unable to be published to the event bus because ` + result.message.toLowerCase());
    }
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});



app.post('/subscribe', (req: Request, res: Response) => {
  const { event_type, service_name, service_port }: Subscribe = req.body;

  if (!service_name || !event_type) {
    res.status(400).send('Service name, service port, and event type required');
    return;
  }

  try {
    const result = eb.subscribe(event_type, service_name.toLowerCase(), service_port);

    if (result.success) {
      res.status(201).send(`\'${service_name}:${service_port}\' successfully subscribed to \'${event_type}\' event`);
    } else {
      res.status(405).send(`\'${service_name}:${service_port}\' was unable to subscribe to \'${event_type}\' event because ` + result.message.toLowerCase());
    }
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});



app.post('/events', async (req: Request, res: Response) => {
  const { type, data }: Event = req.body;

  if (!type) {
    res.status(400).send('Event type required');
    return;
  }

  try {
    const result = await eb.sendEvent(type, data);

    if (result.success) {
      res.status(201).send('Data successfully sent (this may or may not be true I\'m still trying to figure this part out')
    } else {
      console.log(result.failed);
      res.status(405).send('The data was unable to be sent to some (or all) services because ' + result.message.toLowerCase());
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  }
});



app.listen(port, () => {
  console.log(`Event Bus listening on port ${port}`);
});