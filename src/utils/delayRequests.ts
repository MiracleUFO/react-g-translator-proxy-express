import RequestCountModel from '../lib/mongoose';

async function delayMiddleware() {
  const twoSecondsAgo = new Date(Date.now() - 2000);
  const fifteenSecondsAgo = new Date(Date.now() - 15000);
  const oneMinuteAgo = new Date(Date.now() - 60000);

  const RequestCount = await RequestCountModel();
  if (!RequestCount) return 1000;

  const countTwoSeconds = await RequestCount.countDocuments({ updatedAt: { $gte: twoSecondsAgo } });
  const countFifteenSeconds = await RequestCount.countDocuments({ updatedAt: { $gte: fifteenSecondsAgo } });
  const countOneMinute = await RequestCount.countDocuments({ updatedAt: { $gte: oneMinuteAgo } });

  let delay = 1000;

  if (countOneMinute >= 100) delay = 60000 * 2;
  if (countFifteenSeconds >= 10) delay = 15000 * 2;
  if (countTwoSeconds >= 2) delay = 2000 * 2;
  
  return delay;
}

export default delayMiddleware;
