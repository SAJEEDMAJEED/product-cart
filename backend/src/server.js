const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

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

app.listen(PORT, () => {
    console.log(PORT, `Server is running on port: ${PORT}`);
});