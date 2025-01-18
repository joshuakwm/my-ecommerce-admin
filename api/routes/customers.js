import { Router } from 'express';
import { validateCustomer } from '../middleware/validation.js';
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  exportCustomers
} from '../controllers/customers.js';

const router = Router();

// GET /customers - Get all customers
router.get('/', getCustomers);

// GET /customers/:id - Get customer by ID
router.get('/:id', getCustomerById);

// POST /customers - Create new customer
router.post('/', validateCustomer, createCustomer);

// PUT /customers/:id - Update customer
router.put('/:id', validateCustomer, updateCustomer);

// DELETE /customers/:id - Delete customer
router.delete('/:id', deleteCustomer);

// GET /customers/export - Export customer data
router.get('/export', exportCustomers);

export default router;
