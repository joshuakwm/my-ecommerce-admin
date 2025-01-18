import { Router } from 'express';
import dashboardRouter from './dashboard.js';
import productsRouter from './products.js';
import customersRouter from './customers.js';
import ordersRouter from './orders.js';
import logisticsRouter from './logistics.js';
import reportsRouter from './reports.js';

const router = Router();

// API versioning
router.use((req, res, next) => {
  res.setHeader('X-API-Version', '1.0');
  next();
});

// Routes
router.use('/dashboard', dashboardRouter);
router.use('/products', productsRouter);
router.use('/customers', customersRouter);
router.use('/orders', ordersRouter);
router.use('/logistics', logisticsRouter);
router.use('/reports', reportsRouter);

export default router;
