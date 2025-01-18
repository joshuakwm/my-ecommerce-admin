import { Router } from 'express';
import { 
  validateCreateProduct,
  validateUpdateProduct,
  validateProductFilter
} from '../middleware/validation.js';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/products.js';

const router = Router();

// GET /products - Get all products with search/filter
router.get('/', validateProductFilter, getProducts);

// GET /products/:id - Get product by ID
router.get('/:id', getProductById);

// POST /products - Create new product
router.post('/', validateCreateProduct, createProduct);

// PUT /products/:id - Update product
router.put('/:id', validateUpdateProduct, updateProduct);

// DELETE /products/:id - Delete product
router.delete('/:id', deleteProduct);

export default router;
