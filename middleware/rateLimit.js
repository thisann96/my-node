const {rateLimit} = require('express-rate-limit');
const redisClient = require('../database/redis');

const limiter = (maxRequest, time) => {
    return rateLimit({
        windowMs: time,
        limit: maxRequest,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            success: false,
            error: `You have exceeded the ${maxRequest} requests in ${(time / 1000) / 60} minutes limit!`,
            errorCode: 429
        }
    })
}

const ipBlock = (maxApiCalls) => async (req, res, next) => {
    const ip = req.ip;
    const key = `rate-limit:${ip}`;
    const requests = await redisClient.incr(key);

    if (requests >= maxApiCalls) {
        return res.status(429).json({
            success: false,
            error: "Your have exceeded the limit"
        });
    }

    next();
}

module.exports = {limiter, ipBlock};