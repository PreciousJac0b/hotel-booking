import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controllers/clerkWebhooks.js';

connectDB();


const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.use(clerkMiddleware({
  apiKey: process.env.CLERK_SECRET_KEY,
  apiVersion: 2,
}));

app.use('/api/clerk', clerkWebhooks);

app.get('/', (req, res) => {
  res.send('API is working now');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});