const {rateLimit} = require('express-rate-limit');

const limiter = (maxRequest,time) =>{
    return rateLimit({
        windowMs:time,
        limit: maxRequest,
        standardHeaders:true,
        legacyHeaders:false,
        message:{
            success:false,
            error: `You have exceeded the ${maxRequest} requests in ${(time/1000)/60} minutes limit!`,
            errorCode: 429
        }
    })
}

module.exports = {limiter}