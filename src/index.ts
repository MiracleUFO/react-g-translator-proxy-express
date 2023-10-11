import express, { Application } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';

import  ExpressBruteForce from 'express-brute';
import { translate } from '@vitalets/google-translate-api';

import getStore from './lib/mongoose';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

async function startServer() {
  const store = await getStore();
  if (store) {
    const bruteForce = new ExpressBruteForce(store, {
      freeRetries: 1000,
    });
    
    app.use(bruteForce.prevent);
    app.use(bodyParser.json())
    app.use(cors());
    
    app.post(
      '/translate',
      bruteForce.prevent,
      async (req, res) => {
        try {
          const { text, from, to, fetchOptions } = req.body;
          const translation = await translate(text as string, { from, to, fetchOptions });
          console.log(translation);
          return res.status(200).json(JSON.stringify(translation));
        } catch (e) {
          console.error(e);
          return res.status(500).json(JSON.stringify(e));
        }
    });
    
    app.listen(port, () => {
      console.log(`Express server listening on port ${port}`);
    });
    
    app.use((_req, _res, next) => {
      next('404 - RouteNotFound: You\'re falling off the earth 😵‍💫.');
    });
  }
}

startServer();

export default app;
