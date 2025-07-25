import logger from '../config/logger.js';



const errorHandler = (err, req, res, next)=>{
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    logger.error(
        `[${status} ${message} - ${req.method} ${req.originalUrl} - ${req.ip}]`
    );

    res.status(status).json({message});
}


export default errorHandler;