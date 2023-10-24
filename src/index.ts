import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

import { translate } from 'google-translate-api-x';
import { rateLimit } from 'express-rate-limit';

import sleep from './utils/sleep';
import delayMiddleware from './utils/delayRequests';
import RequestCountModel from './lib/mongoose';
import { EXPRESS_RATE_LIMITER_OPTS } from './constants';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

async function startServer() {
  app.set('trust proxy', 1);

  const limiter = rateLimit(EXPRESS_RATE_LIMITER_OPTS);
  const RequestCount = await RequestCountModel();
  if (!RequestCount) return;
  
  app.use(bodyParser.json())
  app.use(cors());
  
  app.post(
    '/translate',
    limiter,
    async (req, res) => {
      try {
        //  this way because react-query acts strange..
        //  when middleware is used as express reccommends
        const delay = await delayMiddleware();

        await sleep(delay);

        const { text, from, to } = req.body;
        const translation = await translate(text as string, {
          from,
          to,
          rejectOnPartialFail: false
        });

        await RequestCount.create({ })

        return res.status(200).json(JSON.stringify(translation));
      } catch (e) {
        const error = e as Error;
        if (
          error.message.includes(('TooManyRequestsError'))
          || error.message.includes('Too Many Requests')
          || error.message.includes('429')
        ) {
          const { text, from, to } = req.body;
          return res.status(429).json(JSON.stringify(e));
        }

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
