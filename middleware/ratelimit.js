import { redis } from '../utils/redis.js';

export async function rateLimit(ip) {

  const key = `ip:${ip}`;

  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 3600);
  }

  if (count > 5) {
    return false;
  }

  return true;
}
