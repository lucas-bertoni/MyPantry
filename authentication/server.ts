// All written by Lucas Bertoni

interface User {
  user_id: number;
  email: string;
  password: string;
  role: number;
  token: string;
}

import express, { Express, Request, Response } from 'express';
import * as helper from './helper.js';
import cors from 'cors';
import axios, { AxiosError, AxiosResponse } from 'axios';
import jwt from 'jsonwebtoken';
import morgan from 'morgan';
import * as dotenv from 'dotenv';
import { UserCreated, LoginSuccess } from './event_types'
import EventBusInterface from '../EventBusInterface';

dotenv.config({ path: '../.env' });


const app: Express = express();
const port: any = process.env.AUTHENTICATION_PORT || 4001;


app.use(morgan('dev'));
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
  exposedHeaders: ['Set-Cookie']
}));
app.use(express.json());


// Middleware used to verify a user's token for authentication purposes
const verifyToken = async (req: any, res: Response, next: any) => {
  if (req.headers.cookie) {
    const token = req.headers.cookie.split('=')[1];

    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }

    try {
      const decoded = jwt.verify(token, String(process.env.TOKEN_KEY));
      req.user = decoded;
  
      if (!(await helper.userExists(req.user.email))) {
        return res.status(401).send("Invalid Token");
      }
    } catch (err) {
      return res.status(401).send("Invalid Token");
    }
  } else {
    return res.status(403).send("A token is required for authentication");
  }
  
  return next();
};



app.post('/login', async (req: Request, res: Response) => {
  const { email, password }: {email: string, password: string} = req.body;

  if (!email || !password) {
    res.status(400).send('All fields required');
    return;
  }

  const user: User = await helper.userExists(email);

  if (!user.email) {
    res.status(401).send('User not found');
    return;
  }

  if (await helper.matchPassword(password, user.password)) {
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, role: user.role },
      String(process.env.TOKEN_KEY),
      {
        expiresIn: '1hr',
      }
    );

    await helper.setToken(user.user_id, token);

    const url = process.env.NODE_ENV === 'production'
      ? 'http://eventbus:' + process.env.EVENTBUS_PORT + '/events'
      : 'http://localhost:' + process.env.EVENTBUS_PORT + '/events';

    const event: LoginSuccess = {
      type: 'LoginSuccess',
      data: {
        user_id: user.user_id,
        email: user.email
      }
    };

    await axios.post(url, event)
      .catch( (axiosError: AxiosError) => {
        console.log('\nThere was an error logging the event');
        console.log(axiosError);
      });

    res.setHeader('Access-Control-Expose-Headers', '*');
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly`);
    res.status(200).json(user);
    return;
  }

  res.status(400).send('Invalid credentials');
});



app.post('/register', async (req: Request, res: Response) => {
  const { email, password }: {email: string, password: string} = req.body;

  if (!email || !password) {
    res.status(400).send('All fields required');
    return;
  }

  if (await helper.userExists(email)) {
    res.status(401).send('User already exists');
    return;
  }

  const newUser: User = await helper.createUser(email, password);

  const token = jwt.sign(
    { user_id: newUser.user_id, email: newUser.email, role: newUser.role },
    String(process.env.TOKEN_KEY),
    {
      expiresIn: '1hr',
    }
  );

  await helper.setToken(newUser.user_id, token);

  const user: User = await helper.getUserByID(newUser.user_id);

  const url = process.env.NODE_ENV === 'production'
    ? 'http://eventbus:' + process.env.EVENTBUS_PORT + '/events'
    : 'http://localhost:' + process.env.EVENTBUS_PORT + '/events';

  const event: UserCreated = {
    type: 'UserCreated',
    data: {
      user_id: user.user_id,
      email: user.email
    }
  };
  
  await axios.post(url, event)
    .catch( (axiosError: AxiosError) => {
      console.log('There was an error logging the event');
      console.log(axiosError);
    });
  

  res.setHeader('Access-Control-Expose-Headers', '*');
  res.setHeader('Set-Cookie', `token=${token}; HttpOnly`);
  res.status(201).json(user);
});



app.post('/auth', verifyToken, (req: any, res: Response) => {
  res.status(200).send(req.user);
});



app.post('/logout', async (req: Request, res: Response) => {
  const token = req.headers.cookie?.split('=')[1];

  res.setHeader('Set-Cookie', 'token=expired; HttpOnly');
  res.status(200).send('Logged out');
});



app.listen(port, async () => {
  console.log(`Authentication listening on ${port}`);

  const ebif = new EventBusInterface('authentication', port);

  await ebif.register();
  await ebif.publish(['UserCreated', 'LoginSuccess']);
})