const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const validate = require('../middleware/validation.middleware');
const schema = require('../validator/user.validator');
const userController = require('../controller/userController');

router.post('/login', authController.login);
router.post('/logout', authController.logout);
// Self-registration (no auth)
router.post('/register', validate(schema.create), userController.create);

module.exports = router;
