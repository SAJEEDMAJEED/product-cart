const { z } = require('zod');

const CartItemSchemas = {
  // Create CartItem
  create: z.object({
    productId: z.string({ message: 'Invalid UUID for productId' }),
    quantity: z
      .number()
      .int({ message: 'Quantity must be an integer' })
      .min(1, { message: 'Quantity must be at least 1' }),
  }),

  // Update CartItem
  update: z.object({
    cartId: z.uuid({ message: 'Invalid UUID for cartId' }).optional(),
    productId: z.uuid({ message: 'Invalid UUID for productId' }).optional(),
    quantity: z
      .number()
      .int({ message: 'Quantity must be an integer' })
      .min(1, { message: 'Quantity must be at least 1' })
      .optional(),
  }),

  params: z.object({
    id: z.uuid({ message: 'Invalid CartItem ID' }),
  }),
};

module.exports = CartItemSchemas;
