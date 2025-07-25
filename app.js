import express from 'express';
import dotenv from 'dotenv'


const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({path: envFile})


import connectDB from './app/config/db.js'
import logger from './app/config/logger.js';
import errorHandler from './app/middleware/error.handler.js';
import AppError from './app/utils/app.error.js';
import orderRoutes from './app/routes/order.routes.js'


const port = process.env.PORT || 4000;

const app = express();
connectDB()



app.use(express.json());




app.get("/", (req, res)=>{
    res.send('Hello world')
})


app.use('/order', orderRoutes);



app.get('/fail', (req, res, next)=>{
    next(new AppError('This route failed on purpose', 400))
})

app.use((req, res, next)=>{
    next(new AppError(`Not Found - ${req.originalUrl}`, 404));
})

app.use(errorHandler);

app.listen(port, ()=>{
    logger.info(`Server up on port: ${port}`)
})