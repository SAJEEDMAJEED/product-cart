const { z } = require('zod');

const UserSchemas = {
    // For creating a user
    create: z.object({
        email: z.string().email({ message: 'Invalid email address' })
            .max(255, { message: 'Email must be at most 255 characters' }),
        password: z.string()
            .min(6, { message: 'Password must be at least 6 characters long' })
            .max(255, { message: 'Password must be at most 255 characters long' }),
        firstName: z.string()
            .min(2, { message: 'First name must be at least 2 characters' })
            .max(50, { message: 'First name must be at most 50 characters' }),
        lastName: z.string()
            .min(1, { message: 'Last name must be at least 1 character' })
            .max(50, { message: 'Last name must be at most 50 characters' }),
        role: z.enum(['superAdmin', 'admin']).optional(),
        isActive: z.boolean().optional(),
    }),

    // For updating a user
    update: z.object({
        email: z.email({ message: 'Invalid email address' })
            .max(255, { message: 'Email must be at most 255 characters' })
            .optional(),
        password: z.string()
            .min(6, { message: 'Password must be at least 6 characters long' })
            .max(255, { message: 'Password must be at most 255 characters' })
            .optional(),
        firstName: z.string()
            .min(2, { message: 'First name must be at least 2 characters' })
            .max(50, { message: 'First name must be at most 50 characters' })
            .optional(),
        lastName: z.string()
            .min(1, { message: 'Last name must be at least 1 character' })
            .max(50, { message: 'Last name must be at most 50 characters' })
            .optional(),
        role: z.enum(['superAdmin', 'admin']).optional(),
        isActive: z.boolean().optional(),
    }),

    // For login
    login: z.object({
        email: z.email({ message: 'Invalid email address' }),
        password: z.string()
            .min(6, { message: 'Password must be at least 6 characters long' }),
    }),
};

module.exports = UserSchemas;
