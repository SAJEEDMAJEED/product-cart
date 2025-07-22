const jwt = require('jsonwebtoken');
const redis = require('../services/redis');
const { User } = require('../db/models');
const logger = require('../utils/logger');
const customError = require('../utils/customError');

async function authenticate(req, res, next) {
    try {
        const token = extractToken(req);
        if (!token) {
            throw customError(401, 'Access denied. No token provided.', { code: 'MISSING_TOKEN' });
        }

        const decoded = verifyToken(token);

        if (process.env.USE_REDIS === 'true') {
            await validateSession(token);
        }

        const user = await getUser(decoded.userId);
        if (!user.isActive) {
            throw customError(401, 'User account is inactive.', { code: 'USER_INACTIVE' });
        }

        req.user = user;
        next();

    } catch (err) {
        logger.error(`[AUTH ERROR] ${err.message}`, err);
        next(err);
    }
}

function extractToken(req) {
    const authHeader = req.headers.authorization || '';
    return authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
}

function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw customError(401, 'Token has expired.', { code: 'TOKEN_EXPIRED' });
        }
        if (err.name === 'JsonWebTokenError') {
            throw customError(401, 'Invalid token format.', { code: 'INVALID_TOKEN' });
        }
        throw customError(401, 'Failed to verify token.', { code: 'VERIFY_FAILED' });
    }
}

async function validateSession(token) {
    const session = await redis.get(token);
    if (!session) {
        throw customError(401, 'Session expired or invalid.', { code: 'SESSION_EXPIRED' });
    }
}

async function getUser(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
        throw customError(401, 'User not found.', { code: 'USER_NOT_FOUND' });
    }
    return user;
}

module.exports = authenticate;
