const { User } = require('../db/models');
const bcrypt = require('bcryptjs');
const createToken = require('../utils/createToken');
const redis = require('../services/redis');

exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        const token = createToken(user.id);

        if (process.env.USE_REDIS === 'true') {
            await redis.set(token, JSON.stringify({ userId: user.id }), 'EX', 60 * 60); // 1h expiry
        }

        res.json({
            success: true,
            message: 'Login successful.',
            token,
            user: user.toJSON()
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Login failed.' });
    }
};

exports.logout = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (process.env.USE_REDIS === 'true' && token) {
            await redis.del(token);
        }
        res.json({ success: true, message: 'Logged out successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Logout failed.' });
    }
};
