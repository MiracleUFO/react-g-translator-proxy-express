import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

import fetch from 'node-fetch';
import { translate } from 'google-translate-api-x';
import { rateLimit } from 'express-rate-limit';

import sleep from './utils/sleep';
import delayMiddleware from './utils/delayRequests';
import RequestCountModel from './lib/mongoose';
import { EXPRESS_RATE_LIMITER_OPTS, TOO_MANY_REQUESTS } from './constants';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

async function startServer() {
  app.set('trust proxy', 1);

  app.use(bodyParser.json())
  app.use(cors());

  const limiter = rateLimit(EXPRESS_RATE_LIMITER_OPTS);

  const RequestCount = await RequestCountModel();
  if (!RequestCount) return;
  
  app.post(
    '/translate',
    limiter,
    async (req, res) => {
      try {
        const delay = await delayMiddleware();

        //  delay applied across all users (irrespective of IP)
        //  as previous limiting by IP still hit Err `429` quickly
        //  if delay makes responses too slow for your use-case
        //  host server and reduce/remove delay
        await sleep(delay);

        const { text, from, to } = req.body;

        const translation = await translate(
          text as string,
          {
            from,
            to,
            rejectOnPartialFail: false,
            requestFunction: fetch,
          }
        );

        await RequestCount.create({ });

        return res.status(200).json(JSON.stringify(translation));
      } catch (e) {
        const error = e as Error;
        console.log('ERROR', e);
  
        if (
          error.message.includes(TOO_MANY_REQUESTS)
          || error.message.includes(TOO_MANY_REQUESTS.replace(/ /g, ''))
          || error.message.includes('429')
        ) return res.status(429).json(error);

        return res.status(500).json(error);
      }
  });
  
  app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
  });
  
  app.use((_req, _res, next) => {
    next('404 - RouteNotFound: You\'re falling off the earth 😵‍💫.');
  });
}

startServer();

export default app;
