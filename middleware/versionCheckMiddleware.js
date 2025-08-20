
const versionCheck = version => (req, res, next) => {

    if (req.path.startsWith(`/api/${version}`)) {
        next()
    } else {
        res.status(404).json({
            success: false,
            error: 'API Version is not match'
        });
    }
}

module.exports = versionCheck;