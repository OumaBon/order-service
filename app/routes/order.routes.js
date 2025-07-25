import express from 'express';
import OrderController from '../controller/order.controller.js';
import {
  createOrderSchema,
  orderIdParamSchema,
  userIdParamSchema
} from '../validators/order.validator.js';
import validate from '../middleware/validate.js'; 
const router = express.Router();
const controller = new OrderController();

// Create an order
router.post(
  '/',
  validate(createOrderSchema, 'body'),
  controller.create.bind(controller)
);

// Get all orders
router.get('/', controller.getOrders.bind(controller));

// Get a single order by ID
router.get(
  '/:id',
  validate(orderIdParamSchema, 'params'),
  controller.getOrder.bind(controller)
);

// Cancel an order
router.post(
  '/:id/cancel',
  validate(orderIdParamSchema, 'params'),
  controller.cancelOrder.bind(controller)
);

// Return an order
router.post(
  '/:id/return',
  validate(orderIdParamSchema, 'params'),
  controller.returnOrder.bind(controller)
);

// Update payment status
router.patch(
  '/:id/payment',
  validate(orderIdParamSchema, 'params'),
  controller.updatePayment.bind(controller)
);

// Update shipping status
router.patch(
  '/:id/shipping',
  validate(orderIdParamSchema, 'params'),
  controller.updateShipping.bind(controller)
);

// Get all orders by a specific user
router.get(
  '/user/:userId',
  validate(userIdParamSchema, 'params'),
  controller.listByUser.bind(controller)
);

export default router;
