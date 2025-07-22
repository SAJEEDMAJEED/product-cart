const Redis = require('ioredis');

const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
});

redis.on('connect', () => {
    console.log('[REDIS] Connected');
});

redis.on('error', (err) => {
    console.error('[REDIS ERROR]', err);
});

module.exports = redis;
