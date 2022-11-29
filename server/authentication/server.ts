// All written by Lucas Bertoni

interface User {
  userid: string;
  email: string;
  password: string;
  role: number;
  token: string;
}

import express, { Express, Request, Response } from 'express';
import * as helper from './helper.js';
import cors from 'cors';
import axios, { AxiosError } from 'axios';
import jwt from 'jsonwebtoken';
import morgan from 'morgan';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });


const app: Express = express();
const port: number = 4001;


// Put this in .env for real deployment
const TOKEN_KEY = 'thisIsATestTokenKey';


app.use(morgan('dev'));
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
  exposedHeaders: ['Set-Cookie']
}));
app.use(express.json());



const verifyToken = async (req: any, res: Response, next: any) => {
  if (req.headers.cookie) {
    const token = req.headers.cookie.split('=')[1];

    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }

    try {
      const decoded = jwt.verify(token, TOKEN_KEY);
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

  if (user && await helper.matchPassword(password, user.password)) {
    const token = jwt.sign(
      { userid: user.userid, email: user.email, role: user.role },
      TOKEN_KEY,
      {
        expiresIn: '1hr',
      }
    );

    await helper.setToken(user.userid, token);

    const url = process.env.NODE_ENV === 'production' ?
      'http://eventbus:4002/events' :
      'http://localhost:4002/events';

    await axios.post(url, { type: 'LoginSuccess', data: { userid: user.userid, email: user.email } })
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
    { userid: newUser.userid, email: newUser.email, role: newUser.role },
    TOKEN_KEY,
    {
      expiresIn: '1hr',
    }
  );

  await helper.setToken(newUser.userid, token);

  const user = await helper.getUserByID(newUser.userid);

  const url = process.env.NODE_ENV === 'production' ?
    'http://eventbus:4002/events' :
    'http://localhost:4002/events';

  await axios.post(url, { type: 'RegisterSuccess', data: { userid: user.userid, email: user.email } })
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

  if (!token) {
    res.status(200).send('Already not logged in');
    return;
  }

  res.setHeader('Set-Cookie', 'token=expired; HttpOnly');
  res.status(200).send('Logged out');
});



app.listen(port, () => {
  console.log(`Authentication listening on ${port}`);
})