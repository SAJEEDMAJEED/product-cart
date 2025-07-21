const logger = require('../utils/logger');
const { ZodError } = require('zod');

module.exports = (err, req, res, next) => {
    let statusCode = err.status || 500;
    let message = err.message || 'Internal server error';
    let errors = [];

    // Handle Zod validation errors (fallback)
    if (err instanceof ZodError) {
        statusCode = 400;
        message = 'Validation failed';
        errors = err.errors.map((error) => ({
            field: error.path.join('.'),
            message: error.message,
        }));
    }

    // Sequelize validation and unique constraint errors
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        statusCode = 400;
        message = 'Database validation failed';
        errors = err.errors.map((e) => ({
            field: e.path,
            message: e.message,
        }));
    }

    logger.error(`[${req.method}] ${req.originalUrl} - ${message}`, err);

    res.status(statusCode).json({
        success: false,
        message,
        ...(errors.length ? { errors } : {}),
        timestamp: new Date().toISOString(),
    });
};
