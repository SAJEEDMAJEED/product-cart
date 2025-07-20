const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const whiteList = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'];
app.use(cors({
    origin: (origin, cbk) => {
        if (whiteList.indexOf(origin) !== -1 || !origin) {
            cbk(null, true);
        } else {
            cbk(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
}));
app.use(helmet());

const limiter = rateLimit({
    window: 15 * 60 * 1000,
    limit: 100,
    message: {
        error: 'too many request from this IP, please try again later',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);


app.listen(PORT, () => {
    console.log(PORT, `Server is running on port: ${PORT}`);
});