const { Cart, CartItem, Product } = require('../db/models');
const customError = require('../utils/customError');

exports.getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
            },
          ],
        },
      ],
    });

    if (!cart) {
      cart = await Cart.create({ userId });
    }

    res.json({
      success: true,
      message: 'Cart fetched successfully',
      data: cart,
    });
  } catch (err) {
    next(err);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    // Find or create user cart
    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      cart = await Cart.create({ userId });
    }

    // Check if item already exists in cart
    let cartItem = await CartItem.findOne({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (cartItem) {
      // Update quantity if item already in cart
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      // Add new item
      cartItem = await CartItem.create({
        cartId: cart.id,
        productId,
        quantity,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Product added to cart successfully',
      data: cartItem,
    });
  } catch (err) {
    console.log('=====', err);

    next(err);
  }
};

exports.updateCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    // Find the cart
    const cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      return next(customError(404, 'Cart not found'));
    }

    // Find the cart item
    const cartItem = await CartItem.findOne({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (!cartItem) {
      return next(customError(404, 'Cart item not found'));
    }

    // Update quantity
    cartItem.quantity = quantity;
    await cartItem.save();

    res.json({
      success: true,
      message: 'Cart item updated successfully',
      data: cartItem,
    });
  } catch (err) {
    next(err);
  }
};

exports.removeCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    // Find the cart
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      return next(customError(404, 'Cart not found'));
    }

    // Find the cart item
    const cartItem = await CartItem.findOne({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (!cartItem) {
      return next(customError(404, 'Cart item not found'));
    }

    await cartItem.destroy();

    res.json({
      success: true,
      message: 'Cart item removed successfully',
    });
  } catch (err) {
    next(err);
  }
};
