const express = require('express');
const validate = require('../middleware/validation.middleware');
const schema = require('../validator/user.validator');
const userController = require('../controller/userController');
const isAuthenticated = require('../utils/authenticate');
const isAuthorized = require('../middleware/isAuthorized.middleware');
const router = express.Router();

router.use(isAuthenticated);
router.use(isAuthorized(['superAdmin']));

router.post('/', validate(schema.create), userController.create);
router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.put('/:id', validate(schema.update), userController.update);
router.delete('/:id', userController.remove);

module.exports = router;
