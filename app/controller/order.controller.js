import OrderService from "../service/order.service.js"
import logger from "../config/logger.js";
import AppError from "../utils/app.error.js";


const orderService = new OrderService();


export default class OrderController {

    // POST/orders
    async create(req, res, next){
        try{
            const order = await orderService.cancelOrder(req.body);
            return res.status(201).json(order);
        }catch(error){
            logger.error(`OrderController - create: ${error.message}`);
            next(error);
        }
    }

    // GET/orders/id
    async getOrder(req, res, next){
        try{
            const order = await orderService.getOrderById(req.params.id);
            return res.status(200).json(order);
        }catch(error){
            logger.error(`OrderController - getById: ${error.message}`);
            next(error);
        }
    }
    // GET/orders
    async getOrders(req, res, next){
        try{
            const orders = await orderService.getAllOrders();
            return res.status(200).json(orders);
        }catch(error){
            logger.error(`OrderController - getAll: ${error.message}`);
            next(error);
        }
    }

    // POST/orders/:id/cancel
    async cancelOrder (req, res, next){
        try{
            const {reason, actorId} = req.body;
            const order = await orderService.cancelOrder(req.params.id, reason, actorId);
            return res.status(200).json(order);
        }catch(error){
            logger.error(`OrderController - cancel: ${error.message}`);
            next(error);
        }
    }

    // POST/orders/:id/return
    async returnOrder(req, res, next){
        try{
            const {reason, actorId} = req.body;
            const order =await orderService.returnOrder(req.params.id, reason, actorId);
            return res.status(200).json(order);
        }catch(error){
            logger.error(`OrderController - return: ${error.message}`);
            next(error);
        }
    }

    // PATCH /orders/:id/payment
    async updatePayment(req, res, next){
        try{
            const {paymentStatus, actorId} = req.body;
            const order = orderService.updatePaymentStatus(req.params.id, paymentStatus, actorId);
            return res.status(200).json(order)
        }catch(err){
            logger.error(`OrderController - updatePayment: ${err.message}`);
            next(err)
        }
    }

    // PATCH/orders/:id/shipping
    async updateShipping(req, res, next){
        try{
            const {shippingStatus, actorId} = req.body;
            const order = await orderService.updateShippingStatus(req.params.id, shippingStatus, actorId);
            return res.status(200).json(order);
        }catch(error){
            logger.error(`OrderContoller - updateShipping: ${error.message}`);
            next(error)
        }
    }

    // GET/users/:userId/orders
    async listByUser(req, res, next){
        try{
            const orders = await orderService.listByUser(req.params.userId);
            return res.status(200).json(orders);
        }catch(error){
            logger.error(`OrderController - listUser: ${error.message}`)
            next(error)
        }
    }


}