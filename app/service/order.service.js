import prisma from '../config/prisma.client.js'
import AppError from '../utils/app.error.js'
import logger from '../config/logger.js'




export default class OrderService {

    // Create a new order
    async createOrder(orderData){
        try{
            const{
                userId,
                items,
                shipping,
                discount,
                tax,
                totalAmount,
                paymentInfo
            } = orderData;
            logger.info(`Creating order for user ${userId} with ${items.length} items`);

            const order = await prisma.order.createOrder({
                data: {
                    userId,
                    totalAmount,
                    items: {create: items},
                    shipping: {create: shipping},
                    discount: discount ? {create: discount} : undefined,
                    tax: tax? {create: tax} : undefined,
                    paymentInfo: paymentInfo? {create: paymentInfo} : undefined,
                    auditLogs: {
                        create: {
                            action: 'ORDER_CREATED',
                            actorId: userId
                        }
                    }
                },
                include: {
                    items: true,
                    shipping: true,
                    discount: true,
                    tax: true,
                    paymentInfo: true,
                    auditLogs: true
                }
            });
            logger.info(`Order ${order.id} created successfully for user ${userId}`);
            return order;
        }catch(error){
            logger.error(`Failed to create order: ${error.message}`);
            throw new AppError('Failed to create order', 500);
        }

    }

    // Get an order by ID

    async getOrderById(id){
        try{
            logger.info(`Fetching order with ID: ${id}`);
            const order = await prisma.order.findUnique({
                where: {id},
                include: {
                    items: true,
                    shipping: true,
                    discount: true,
                    tax: true,
                    paymentInfo: true,
                    cancellation: true,
                    return: true,
                    auditLogs: true
                }
            });
            if(!order){
                logger.warn(`Order with ID ${id} not found`);
                throw new AppError('Order not found', 404);
            }

            return order;

        }catch(error){
            logger.error(`Error retrieving order ${id}: ${error.message}`);
            throw error;
        }
    }

    // Get all orders
    async getAllOrders(){
        try{
            logger.info('Fetching all orders');

            const orders = await prisma.order.findMany({
                include: {
                    items: true,
                    shipping: true
                }
            });
            logger.info(`Retrived ${orders.length} orders`);
            return orders;

        }catch(error){
            logger.error(`Failed to fetch orders: ${error.message}`);
            throw new AppError('Failed to retrive orders', 500);
        }
    }

    // Cancel Order

    async cancelOrder(id, reason, actorId){
        try{
            logger.info(`Cancelling order ${id} by ${actorId}`);
            const order = await prisma.order.update({
                where: {id},
                data: {
                    status: 'CANCELLED',
                    cancellation: {create: {reason}},
                    auditLogs: {create: {action: "ORDER_CANCELLED", actorId}}
                },
                include: {cancelation: true, auditLogs: true}
            });
            return order;
        }catch(error){
            logger.error(`Failed to cancel order ${id}: ${error.message}`);
            throw new AppError('Could not cancel order', 500);
        }
    }

    // Return Order
    async returnOrder(id, reason, actorId){
        try{
            logger.info(`Returning order ${id} by ${actorId}`);
            const order = await prisma.order.update({
                where: {id},
                data: {
                    status: "RETURNED",
                    return: {create: {reason}},
                    auditLogs: {create: {action: "ORDER_RETURNED", actorId}}
                },
                include: {return: true, auditLogs: true}
            });
            return order;
        }catch(err){
            logger.error(`Failed to return order ${id}: ${err.message}`)
            throw new AppError('Coulf not return order', 500);
        }
    }

    // Update PaymentStatus
    async updatePaymentStatus(id, paymentStatus, actorId){
        try{
            logger.info(`Updating payment for ${id} to ${paymentStatus}`);
            const order = await prisma.order.update({
                where: {id},
                data: {
                    paymentStatus,
                    auditLogs: {
                        create: {action: `PAYMENT_STATUS_${paymentStatus}`},
                        actorId
                    }
                }
            });
            return order;
        }catch(error){
            logger.error(`Failed to update payment status for ${id}: ${error.message}`);
            throw new AppError('Could not update payment status', 500)
        }
    }

    // Upadate Shipping Status
    async updateShippingStatus(id, shippingStatus, actorId){
        try{
            logger.info(`Updating shipping for ${id} to ${shippingStatus}`);
            const order = await prisma.order.update({
                where: {id},
                data: {
                    shippingStatus,
                    auditLogs: {
                        create: {action: `SHIPPING_STATUS_${shippingStatus}`},
                        actorId
                    }
                }
            });
            return order;
        }catch(error){
            logger.error(`Failed to update shipping for ${id}:${error.message}`);
            throw new AppError('Could not update shipping status', 500);
        }
    }

    async listByUser(userId){
        logger.info(`Listing orders for user ${userId}`);
        return prisma.order.findMany({
            where: {userId},
            include: {items: true, shipping: true}
        });
    }



}






