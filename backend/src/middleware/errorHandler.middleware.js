const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
    let statusCode = err.status || 500;
    let message = err.message || 'Internal server error';
    let errors = err.errors || undefined;

    logger.error(`[${req.method}] ${req.originalUrl} - ${message}`, { error: err });

    res.status(statusCode).json({
        success: false,
        message,
        ...(errors ? { errors } : {}),
        timestamp: new Date().toISOString()
    });
};
