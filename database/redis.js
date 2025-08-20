const redis = require("redis");

const redisClient = redis.createClient({
     url: 'redis://localhost:6379'
});
   
// Connect and handle errors
redisClient.connect().catch(console.error);

module.exports = redisClient