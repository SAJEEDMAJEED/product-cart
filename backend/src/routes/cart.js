const express = require('express');
const router = express.Router();
const cartController = require('../controller/cartController');
const validate = require('../middleware/validation.middleware');
const isAuthorized = require('../middleware/isAuthorized.middleware');
const { create, update } = require('../validator/cartItem.validator');
const isAuthenticated = require('../utils/authenticate');

router.use(isAuthenticated);
router.use(isAuthorized(['user']));

router.get('/', cartController.getCart);

router.post('/', validate(create), cartController.addToCart);

router.put('/', validate(update), cartController.updateCartItem);

router.delete('/:productId', cartController.removeCartItem);

module.exports = router;
