const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const compression = require('compression');
dotenv.config();


const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler.middleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1);

app.use(morgan(':date[clf] :remote-addr :method :url :status :res[content-length] - :response-time ms'));

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
    max: 100,
    message: {
        error: 'too many request from this IP, please try again later',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);
app.use(compression({ filter: shouldCompress }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
}
function shouldCompress(req, res) {
    // Bypass compression if request came from NGINX
    if (req.headers['x-no-compression']) {
        return false;
    }
    return compression.filter(req, res);
}

app.get('/', (req, res) => {
    res.json({ message: 'Hello !' });
});

app.use((req, res, next) => {
    res.status(404).send({ message: 'The page you are looking for is not found!' });
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(PORT, `Server is running on port: ${PORT}`);
});