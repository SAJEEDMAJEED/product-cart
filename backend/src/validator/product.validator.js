const { z } = require('zod');

const ProductSchemas = {
    //  Create product
    create: z.object({
        name: z.string()
            .min(2, { message: 'Product name must be at least 2 characters' })
            .max(100, { message: 'Product name must be at most 100 characters' }),

        description: z.string().optional(),

        price: z.number()
            .min(0, { message: 'Price must be a positive number' })
            .multipleOf(0.01, { message: 'Price must have at most 2 decimal places' }),

        stock: z.number()
            .int({ message: 'Stock must be an integer' })
            .min(0, { message: 'Stock cannot be negative' }),

        imageUrl: z.string().url({ message: 'Invalid image URL' }).optional(),

        sku: z.string()
            .max(255, { message: 'SKU must be at most 255 characters' })
            .optional(),

        category: z.string().max(255).optional(),

        isActive: z.boolean().optional(),

        createdBy: z.uuid({ message: 'Invalid UUID for createdBy' })
            .optional(),

        updatedBy: z.uuid({ message: 'Invalid UUID for updatedBy' })
            .optional(),
    }),

    //  Update product
    update: z.object({
        name: z.string()
            .min(2)
            .max(100)
            .optional(),

        description: z.string().optional(),

        price: z.number()
            .min(0)
            .multipleOf(0.01)
            .optional(),

        stock: z.number()
            .int()
            .min(0)
            .optional(),

        imageUrl: z.url().optional(),

        sku: z.string().max(255).optional(),

        category: z.string().max(255).optional(),

        isActive: z.boolean().optional(),

        updatedBy: z.uuid({ message: 'Invalid UUID for updatedBy' })
            .optional(),
    }),
};

module.exports = ProductSchemas;
