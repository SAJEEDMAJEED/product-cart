const { Product } = require('../db/models');
const customError = require('../utils/customError');

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.json({
      success: true,
      message: 'Products fetched successfully',
      data: products,
    });
  } catch (err) {
    next(err);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return next(customError(404, 'Product not found'));
    }
    res.json({
      success: true,
      message: 'Product fetched successfully',
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    console.log('===');

    const { name, description, price, stock, imageUrl, sku, category } =
      req.body;

    const newProduct = await Product.create({
      name,
      description,
      price,
      stock,
      imageUrl,
      sku,
      category,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return next(customError(404, 'Product not found'));
    }

    await product.update({
      ...req.body,
      updatedBy: req.user.id,
    });

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return next(customError(404, 'Product not found'));
    }

    await product.destroy();

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
