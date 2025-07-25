import { z } from 'zod';

// Schema for creating an order
export const createOrderSchema = z.object({
  userId: z.string().uuid(),
  totalAmount: z.number().nonnegative(),
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().min(1),
      price: z.number().nonnegative()
    })
  ),
  shipping: z.object({
    fullName: z.string(),
    address1: z.string(),
    address2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string(),
    phone: z.string()
  }),
  discount: z
    .object({
      code: z.string(),
      amount: z.number().nonnegative()
    })
    .optional(),
  tax: z
    .object({
      taxRate: z.number().nonnegative(),
      taxAmount: z.number().nonnegative()
    })
    .optional(),
  paymentInfo: z
    .object({
      provider: z.string(),
      transactionId: z.string(),
      paidAt: z.string().datetime()
    })
    .optional()
});

// Schema for validating :id route param (orderId)
export const orderIdParamSchema = z.object({
  id: z.string().uuid()
});

// Schema for validating :userId route param
export const userIdParamSchema = z.object({
  userId: z.string().uuid()
});
