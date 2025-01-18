import Joi from 'joi';

// Base product schema
const productSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  category: Joi.string().max(50).allow(''),
  price: Joi.number().positive().precision(2).required(),
  stock_quantity: Joi.number().integer().min(0).default(0),
  description: Joi.string().max(1000).allow(''),
  image_url: Joi.string().uri().allow(''),
  featured: Joi.boolean().default(false)
});

// Schema for creating new product
export const createProductSchema = productSchema;

// Schema for updating product
export const updateProductSchema = productSchema.keys({
  name: Joi.string().min(3).max(100),
  price: Joi.number().positive().precision(2),
  stock_quantity: Joi.number().integer().min(0)
});

// Schema for product search/filter
export const productFilterSchema = Joi.object({
  search: Joi.string().max(100).allow(''),
  category: Joi.string().max(50).allow(''),
  minPrice: Joi.number().positive().precision(2),
  maxPrice: Joi.number().positive().precision(2),
  inStock: Joi.string().valid('true', 'false')
});
