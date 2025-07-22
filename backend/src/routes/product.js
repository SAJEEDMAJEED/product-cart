const express = require('express');
const router = express.Router();
const validate = require('../middleware/validation.middleware');
const schema = require('../validator/product.validator');
const productController = require('../controller/productController');
const isAuthorized = require('../middleware/isAuthorized.middleware');
const isAuthenticated = require('../utils/authenticate');

router.use(isAuthenticated);

router.get('/', productController.getAllProducts);

router.get('/:id', productController.getProductById);

router.post(
  '/',
  validate(schema.create),
  isAuthorized(['superAdmin', 'admin']),
  productController.createProduct
);

router.put(
  '/:id',
  validate(schema.update),
  isAuthorized(['superAdmin', 'admin']),
  productController.updateProduct
);

router.delete(
  '/:id',
  isAuthorized(['superAdmin']),
  productController.deleteProduct
);

module.exports = router;
