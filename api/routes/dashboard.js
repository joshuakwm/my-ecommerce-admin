import express from 'express';
import { getDashboardMetrics, getRecentOrders } from '../controllers/dashboard.js';

const router = express.Router();

// GET /api/dashboard/stats
router.get('/stats', getDashboardMetrics);

// GET /api/dashboard/recent-orders
router.get('/recent-orders', getRecentOrders);

export default router;
