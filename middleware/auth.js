const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const {responseFail} = require('../helpers/responseHelper');

const auth = asyncHandler(async (req, res, next) => {
    const headers = req.headers["authorization"];
    const token = headers && headers.split(" ")[1];

    if (!token) responseFail(res, "Access denied", 403);

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        req.userInfo = decodedToken;
        next();

    } catch (error) {
        responseFail(res, error.message, 400);
    }


});

module.exports = auth;