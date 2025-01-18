import { Router } from 'express';
import {
  getSalesReports,
  generateSalesReport,
  getReportById,
  deleteReport
} from '../controllers/reports.js';

const router = Router();

// GET /reports - Get all sales reports
router.get('/', getSalesReports);

// POST /reports/generate - Generate new sales report
router.post('/generate', generateSalesReport);

// GET /reports/:id - Get report by ID
router.get('/:id', getReportById);

// DELETE /reports/:id - Delete report
router.delete('/:id', deleteReport);

export default router;
