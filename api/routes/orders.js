import { Router } from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
} from '../controllers/orders.js';

const router = Router();

// GET /orders - Get all orders
router.get('/', getOrders);

// GET /orders/:id - Get order by ID
router.get('/:id', getOrderById);

// POST /orders - Create new order
router.post('/', createOrder);

// PUT /orders/:id - Update order
router.put('/:id', updateOrder);

// DELETE /orders/:id - Delete order
router.delete('/:id', deleteOrder);

export default router;
