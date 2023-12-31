const express = require("express");
const cors = require("cors");
require('dotenv').config();
const morgan = require('morgan');

const globalErrHandler = require('./src/middlewares/globalErrorHandler')
const AppError = require('./src/utils/AppError')
const authRoute = require('./src/routes/auth')
const adminRoute = require('./src/routes/admin')

//Config

const app = express();
app.use(
    cors({
        origin: true,
        credentials: true,
    }),
);

app.use(express.json());

if(process.env.NODE_ENV !== 'production'){
    app.use(morgan('dev'));
}

app.get('/', (req,res)=>{
    res.send('Hello Hifi');
})
app.use('api/admin',adminRoute);
app.use('api/auth',authRoute);

app.all('*', (req,res,next)=>{
    const error = new AppError(
        `Cant find ${req.originalUrl} on this server`,
        404,
    );
    next(error);
})

app.use(globalErrHandler);

module.exports = app;