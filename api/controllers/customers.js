import { ApiError } from '../errors/index.js';
import { sequelize } from '../db.js';

// Get all customers
export const getCustomers = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT customer_id, name, email, phone, address, 
      registration_date, newsletter_opt_in, subscription_status
      FROM customers`
    );
    res.json(rows);
  } catch {
    next(new ApiError(500, 'Failed to fetch customers'));
  }
};

// Get customer by ID
export const getCustomerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(
      `SELECT customer_id, name, email, phone, address, 
      registration_date, newsletter_opt_in, subscription_status
      FROM customers WHERE customer_id = $1`,
      [id]
    );
    
    if (rows.length === 0) {
      return next(new ApiError(404, 'Customer not found'));
    }
    
    res.json(rows[0]);
  } catch {
    next(new ApiError(500, 'Failed to fetch customer'));
  }
};

// Create new customer
export const createCustomer = async (req, res, next) => {
  try {
    const { name, email, phone, address, newsletter_opt_in } = req.body;
    const { rows } = await db.query(
      `INSERT INTO customers 
      (name, email, phone, address, newsletter_opt_in)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [name, email, phone, address, newsletter_opt_in]
    );
    
    res.status(201).json(rows[0]);
  } catch {
    next(new ApiError(500, 'Failed to create customer'));
  }
};

// Update customer
export const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, newsletter_opt_in } = req.body;
    
    const { rows } = await db.query(
      `UPDATE customers SET
      name = $1,
      email = $2,
      phone = $3,
      address = $4,
      newsletter_opt_in = $5
      WHERE customer_id = $6
      RETURNING *`,
      [name, email, phone, address, newsletter_opt_in, id]
    );
    
    if (rows.length === 0) {
      return next(new ApiError(404, 'Customer not found'));
    }
    
    res.json(rows[0]);
  } catch {
    next(new ApiError(500, 'Failed to update customer'));
  }
};

// Delete customer
export const deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await db.query(
      'DELETE FROM customers WHERE customer_id = $1',
      [id]
    );
    
    if (rowCount === 0) {
      return next(new ApiError(404, 'Customer not found'));
    }
    
    res.status(204).send();
  } catch {
    next(new ApiError(500, 'Failed to delete customer'));
  }
};

// Export customers
export const exportCustomers = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT customer_id, name, email, phone, address, 
      registration_date, newsletter_opt_in, subscription_status
      FROM customers`
    );
    
    // Convert to CSV format
    const csv = [
      Object.keys(rows[0]).join(','),
      ...rows.map(row => Object.values(row).join(','))
    ].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=customers.csv');
    res.send(csv);
  } catch {
    next(new ApiError(500, 'Failed to export customers'));
  }
};
