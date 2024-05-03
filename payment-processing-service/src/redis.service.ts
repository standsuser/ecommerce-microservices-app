import { Injectable } from '@nestjs/common';
import * as Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redisClient: Redis.Redis;

  constructor() {
    this.redisClient = new Redis.Redis({
      host: 'localhost', // Redis server host
      port: 6379,        // Redis server port
    });
  }

  // Implement methods to interact with Redis (e.g., set, get, publish, subscribe, etc.)
}