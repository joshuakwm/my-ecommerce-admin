import { Router } from 'express';
import {
  getLogisticsPartners,
  getLogisticsPartnerById,
  createLogisticsPartner,
  updateLogisticsPartner,
  deleteLogisticsPartner
} from '../controllers/logistics.js';

const router = Router();

// GET /logistics - Get all logistics partners
router.get('/', getLogisticsPartners);

// GET /logistics/:id - Get logistics partner by ID
router.get('/:id', getLogisticsPartnerById);

// POST /logistics - Create new logistics partner
router.post('/', createLogisticsPartner);

// PUT /logistics/:id - Update logistics partner
router.put('/:id', updateLogisticsPartner);

// DELETE /logistics/:id - Delete logistics partner
router.delete('/:id', deleteLogisticsPartner);

export default router;
