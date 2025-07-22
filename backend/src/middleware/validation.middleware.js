const { ZodError } = require('zod');

const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: error.errors.map(e => ({
                    path: e.path.join('.'),
                    message: e.message
                })),
            });
        }

        // Fallback for other errors
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error',
        });
    }
};

module.exports = validate;