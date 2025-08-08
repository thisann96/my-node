
const isAdmin = (req, res, next) => {
    if (req.userInfo.role != 'admin') {
        res.status(401).json({
            success: false,
            message: 'You are not admin'
        });
    }

    next();
}

module.exports = isAdmin