const { z } = require('zod');

const CartSchemas = {
  // Create Cart
  create: z.object({
    userId: z.uuid({ message: 'Invalid UUID for userId' }),
  }),

  //  Update Cart
  update: z.object({
    userId: z.uuid({ message: 'Invalid UUID for userId' }).optional(),
  }),

  // Params validation
  params: z.object({
    id: z.uuid({ message: 'Invalid Cart ID' }),
  }),
};

module.exports = CartSchemas;
