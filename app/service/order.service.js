import prisma from '../config/prisma.client.js'
import AppError from '../utils/app.error.js'
import logger from '../config/logger.js'


export default class OrderService {

  // ✅ Create a new order
  async createOrder(orderData) {
    try {
      const {
        userId,
        items,
        shipping,
        discount,
        tax,
        totalAmount,
        paymentInfo
      } = orderData;

      logger.info(`Creating order for user ${userId} with ${items.length} items`);

      const order = await prisma.order.create({
        data: {
          userId,
          totalAmount,
          items: { create: items },
          shipping: { create: shipping },
          discount: discount ? { create: discount } : undefined,
          tax: tax ? { create: tax } : undefined,
          paymentInfo: paymentInfo ? { create: paymentInfo } : undefined,
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

    } catch (error) {
      logger.error(`Failed to create order: ${error.message}`);
      throw new AppError('Failed to create order', 500);
    }
  }

  // ✅ Get an order by ID
  async getOrderById(id) {
    try {
      logger.info(`Fetching order with ID: ${id}`);

      const order = await prisma.order.findUnique({
        where: { id },
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

      if (!order) {
        logger.warn(`Order with ID ${id} not found`);
        throw new AppError('Order not found', 404);
      }

      return order;

    } catch (error) {
      logger.error(`Error retrieving order ${id}: ${error.message}`);
      throw error;
    }
  }

  // ✅ Get all orders
  async getAllOrders() {
    try {
      logger.info('Fetching all orders');

      const orders = await prisma.order.findMany({
        include: {
          items: true,
          shipping: true
        }
      });

      logger.info(`Retrieved ${orders.length} orders`);
      return orders;

    } catch (error) {
      logger.error(`Failed to fetch orders: ${error.message}`);
      throw new AppError('Failed to retrieve orders', 500);
    }
  }

  // ✅ Cancel an order
  async cancelOrder(id, reason, actorId) {
    try {
      if (!reason || !actorId) {
        throw new AppError('Reason and actorId are required to cancel order', 400);
      }

      logger.info(`Cancelling order ${id} by ${actorId}`);

      const order = await prisma.order.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          cancellation: { create: { reason } },
          auditLogs: { create: { action: 'ORDER_CANCELLED', actorId } }
        },
        include: { cancellation: true, auditLogs: true }
      });

      return order;

    } catch (error) {
      logger.error(`Failed to cancel order ${id}: ${error.message}`);
      throw new AppError('Could not cancel order', 500);
    }
  }

  // ✅ Return an order
  async returnOrder(id, reason, actorId) {
    try {
      if (!reason || !actorId) {
        throw new AppError('Reason and actorId are required to return order', 400);
      }

      logger.info(`Returning order ${id} by ${actorId}`);

      const order = await prisma.order.update({
        where: { id },
        data: {
          status: 'RETURNED',
          return: { create: { reason } },
          auditLogs: { create: { action: 'ORDER_RETURNED', actorId } }
        },
        include: { return: true, auditLogs: true }
      });

      return order;

    } catch (error) {
      logger.error(`Failed to return order ${id}: ${error.message}`);
      throw new AppError('Could not return order', 500);
    }
  }

  // ✅ Update payment status
  async updatePaymentStatus(id, paymentStatus, actorId) {
    try {
      if (!actorId) {
        throw new AppError('actorId is required to update payment status', 400);
      }

      logger.info(`Updating payment status of order ${id} to ${paymentStatus}`);

      const order = await prisma.order.update({
        where: { id },
        data: {
          paymentStatus,
          auditLogs: {
            create: {
              action: `PAYMENT_STATUS_${paymentStatus}`,
              actorId
            }
          }
        }
      });

      return order;

    } catch (error) {
      logger.error(`Failed to update payment status for ${id}: ${error.message}`);
      throw new AppError('Could not update payment status', 500);
    }
  }

  // ✅ Update shipping status
  async updateShippingStatus(id, shippingStatus, actorId) {
    try {
      if (!actorId) {
        throw new AppError('actorId is required to update shipping status', 400);
      }

      logger.info(`Updating shipping status of order ${id} to ${shippingStatus}`);

      const order = await prisma.order.update({
        where: { id },
        data: {
          shippingStatus,
          auditLogs: {
            create: {
              action: `SHIPPING_STATUS_${shippingStatus}`,
              actorId
            }
          }
        }
      });

      return order;

    } catch (error) {
      logger.error(`Failed to update shipping status for ${id}: ${error.message}`);
      throw new AppError('Could not update shipping status', 500);
    }
  }

  // ✅ List orders by user ID
  async listByUser(userId) {
    try {
      logger.info(`Listing orders for user ${userId}`);
      return await prisma.order.findMany({
        where: { userId },
        include: { items: true, shipping: true }
      });
    } catch (error) {
      logger.error(`Failed to list orders for user ${userId}: ${error.message}`);
      throw new AppError('Could not retrieve user orders', 500);
    }
  }
}
