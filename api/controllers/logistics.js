import Logistics from '../models/logistics.js';

// Get all logistics partners
export const getLogisticsPartners = async (req, res) => {
  try {
    const partners = await Logistics.findAll();
    res.json(partners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single logistics partner by ID
export const getLogisticsPartnerById = async (req, res) => {
  try {
    const partner = await Logistics.findByPk(req.params.id);
    if (!partner) {
      return res.status(404).json({ message: 'Logistics partner not found' });
    }
    res.json(partner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new logistics partner
export const createLogisticsPartner = async (req, res) => {
  try {
    const newPartner = await Logistics.create(req.body);
    res.status(201).json(newPartner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update logistics partner
export const updateLogisticsPartner = async (req, res) => {
  try {
    const [updated] = await Logistics.update(req.body, {
      where: { partner_id: req.params.id }
    });
    
    if (!updated) {
      return res.status(404).json({ message: 'Logistics partner not found' });
    }
    
    const updatedPartner = await Logistics.findByPk(req.params.id);
    res.json(updatedPartner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete logistics partner
export const deleteLogisticsPartner = async (req, res) => {
  try {
    const deleted = await Logistics.destroy({
      where: { partner_id: req.params.id }
    });
    
    if (!deleted) {
      return res.status(404).json({ message: 'Logistics partner not found' });
    }
    
    res.json({ message: 'Logistics partner deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
