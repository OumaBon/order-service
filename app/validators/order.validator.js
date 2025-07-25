import {z} from 'zod';


export const orderSchema = z.object({
    userId: z.string().uuid(),
    totalAmount: z.number().min(0),
    items: z.array(
        z.object({
            productId: z.string().uuid(),
            quantity: z.number().int().min(1)
        })
    ),
    shipping: z.object({
        address: z.string(),
        city: z.string(),
        country: z.string(),
        postalCode: z.string()
    }),
    discount: z.optional(z.object({
        code: z.string(),
        amount: z.number()
    })),
    tax: z.optional(z.object({
        type: z.string(),
        amount: z.number()
    })),
    paymentInfo: z.optional(z.object({
        method: z.string(),
        status: z.string()
    }))

});