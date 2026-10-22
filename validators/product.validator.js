import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Product name is required' }).min(1, 'Name is required').max(255),
    description: z.string().optional().default(''),
    category: z.string().optional().default('সকল সামগ্রী'),
    tag: z.string().optional().default('বিশুদ্ধ সামগ্রী'),
    imageUrl: z.string().optional(),
    originalPrice: z.coerce
      .number({ required_error: 'Original price is required' })
      .positive('Original price must be greater than zero'),
    discountPrice: z.preprocess(
      (val) => (val === '' || val === null || val === undefined ? null : Number(val)),
      z.number().nonnegative('Discount price cannot be negative').nullable().optional()
    ),
  }).refine((data) => {
    if (data.discountPrice !== null && data.discountPrice !== undefined) {
      return data.discountPrice <= data.originalPrice;
    }
    return true;
  }, {
    message: 'Discount price must be less than or equal to original price',
    path: ['discountPrice'],
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(255).optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    tag: z.string().optional(),
    imageUrl: z.string().optional(),
    originalPrice: z.coerce
      .number()
      .positive('Original price must be greater than zero')
      .optional(),
    discountPrice: z.preprocess(
      (val) => (val === '' || val === null || val === undefined ? null : Number(val)),
      z.number().nonnegative('Discount price cannot be negative').nullable().optional()
    ),
    deleteImageIds: z.union([z.string(), z.array(z.string())]).optional(),
  }).refine((data) => {
    if (data.originalPrice !== undefined && data.discountPrice !== undefined && data.discountPrice !== null) {
      return data.discountPrice <= data.originalPrice;
    }
    return true;
  }, {
    message: 'Discount price must be less than or equal to original price',
    path: ['discountPrice'],
  }),
});