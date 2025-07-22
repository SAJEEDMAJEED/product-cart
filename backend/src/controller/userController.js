const { User } = require('../db/models');
const createError = require('../utils/customError');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

exports.create = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw createError(409, 'User with this email already exists', {
        code: 'EMAIL_EXISTS',
      });
    }

    let assignedRole = role;

    if (req.user) {
      if (req.user.role === 'superAdmin') {
        // superAdmin can create superAdmin and admin
        if (!['superAdmin', 'admin'].includes(role)) {
          throw createError(
            400,
            'SuperAdmin can only create superAdmin or admin',
            { code: 'INVALID_ROLE' }
          );
        }
      } else {
        // admin and normal users cannot create anyone
        throw createError(
          403,
          'Forbidden: You are not allowed to create users.',
          { code: 'FORBIDDEN' }
        );
      }
    } else {
      // Self-registration (unauthenticated)
      if (role && role !== 'user') {
        throw createError(
          403,
          'You cannot assign role during registration. Role defaults to user.',
          { code: 'FORBIDDEN_ROLE_ASSIGNMENT' }
        );
      }
      assignedRole = 'user';
    }

    const user = await User.create({
      email,
      password, // Already hashed in model hook
      firstName,
      lastName,
      role: assignedRole,
    });

    logger.info(`User created: ${user.email} (${user.role})`);
    res.status(201).json({
      success: true,
      message: `User (${user.role}) created successfully`,
      data: user.toJSON(),
    });
  } catch (err) {
    next(err);
  }
};

// Get All Users (superAdmin only, exclude passwords)
exports.getAll = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      where: {
        role: { [Op.ne]: 'superAdmin' },
      },
    });
    res.json({
      success: true,
      message: 'Users fetched successfully',
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// Get user by ID
exports.getById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    });
    if (!user)
      throw createError(404, 'User not found', { code: 'USER_NOT_FOUND' });

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user.toJSON(),
    });
  } catch (err) {
    next(err);
  }
};

// Update user
exports.update = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user)
      throw createError(404, 'User not found', { code: 'USER_NOT_FOUND' });

    // Role update restrictions
    if (req.body.role && req.user.role !== 'superAdmin') {
      throw createError(403, 'Only superAdmin can change user roles', {
        code: 'FORBIDDEN_ROLE_UPDATE',
      });
    }

    await user.update(req.body); // password auto-hashed if changed
    logger.info(`User updated: ${user.email}`);
    res.json({
      success: true,
      message: 'User updated successfully',
      data: user.toJSON(),
    });
  } catch (err) {
    next(err);
  }
};

// Delete user (soft delete)
exports.remove = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user)
      throw createError(404, 'User not found', { code: 'USER_NOT_FOUND' });

    // Prevent superAdmin from deleting themselves
    if (req.user.id === user.id && req.user.role === 'superAdmin') {
      throw createError(403, 'SuperAdmin cannot delete themselves', {
        code: 'SELF_DELETE_FORBIDDEN',
      });
    }

    await user.destroy();
    logger.info(`User deleted: ${user.email}`);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};
