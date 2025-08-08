const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    const headers = req.headers["authorization"];
    const token = headers && headers.split(" ")[1];
    if (!token) {
        res.status(401).json({
            success: false,
            message: 'Access denied'
        });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        req.userInfo = decodedToken;

        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            success: false,
            message: 'Something went wrong'
        });
    }
}

module.exports = auth;