const { User } = require('../db/models');
const createError = require('../utils/customError');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

// Create a new user (superAdmin only)
exports.create = async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ where: { email: req.body.email } });
        if (existingUser) {
            throw createError(409, 'User with this email already exists', { code: 'EMAIL_EXISTS' });
        }

        const user = await User.create(req.body);
        logger.info(`User created: ${user.email}`);
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: user.toJSON()
        });
    } catch (err) {
        next(err);
    }
};

// Get All Users
exports.getAll = async (req, res, next) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            where: {
                role: {
                    [Op.ne]: 'superAdmin'
                }
            }
        });
        res.json({
            success: true,
            message: 'Users fetched successfully',
            data: users
        });
    } catch (err) {
        next(err);
    }
};

// Get user by ID
exports.getById = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) throw createError(404, 'User not found', { code: 'USER_NOT_FOUND' });

        res.status(200).json({
            success: true,
            message: 'User retrieved successfully',
            data: user.toJSON()
        });
    } catch (err) {
        next(err);
    }
};

// Update user
exports.update = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) throw createError(404, 'User not found', { code: 'USER_NOT_FOUND' });

        await user.update(req.body);
        logger.info(`User updated: ${user.email}`);
        res.json({
            success: true,
            message: 'User updated successfully',
            data: user.toJSON()
        });
    } catch (err) {
        next(err);
    }
};

// Delete user (soft delete)
exports.remove = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) throw createError(404, 'User not found', { code: 'USER_NOT_FOUND' });

        await user.destroy();
        logger.info(`User deleted: ${user.email}`);
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (err) {
        next(err);
    }
};
