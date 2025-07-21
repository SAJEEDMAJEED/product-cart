const { ZodError } = require('zod');

const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            params: req.params,
            body: req.body,
            query: req.query,
        });

        next();
    } catch (err) {
        if (err instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: err.errors.map(e => ({
                    path: e.path.join('.'),
                    message: e.message
                })),
            });
        }
        next(err);
    }
};

module.exports = validate;
