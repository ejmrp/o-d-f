import { redis } from '../utils/redis.js';

export async function checkCooldown(address) {

  const key = `claim:${address}`;

  const exists = await redis.get(key);

  if (exists) {
    return false;
  }

  await redis.set(
    key,
    Date.now(),
    {
      ex: 86400
    }
  );

  return true;
}
