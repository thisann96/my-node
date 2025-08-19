
class APIError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.status = statusCode;
        this.name = 'APIError';
    }
}

const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fu => (req, res, next)).catch(next);
}

const globalErrorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err instanceof APIError) {
        return res.status(err.status).json({
            status: 'Error Occurs',
            message: err.message
        });
    }

}

module.exports = {
    APIError,
    asyncHandler,
    globalErrorHandler
}