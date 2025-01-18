import SalesReport from '../models/salesReport.js';

// Generate sales report
export const generateSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    
    // Get orders within date range
    const orders = await Order.find({
      created_at: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).populate('customer_id');

    // Calculate report metrics
    const totalSales = orders.reduce((sum, order) => sum + order.total_amount, 0);
    const ordersCount = orders.length;
    
    // Create new report
    const newReport = new SalesReport({
      date_range: { start: startDate, end: endDate },
      total_sales: totalSales,
      orders_count: ordersCount
    });

    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all sales reports
export const getSalesReports = async (req, res) => {
  try {
    const reports = await SalesReport.find().sort({ created_at: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single report by ID
export const getReportById = async (req, res) => {
  try {
    const report = await SalesReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export report
export const exportReport = async (req, res) => {
  try {
    const report = await SalesReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const format = req.query.format || 'json';
    
    switch(format) {
      case 'csv':
        // Convert report to CSV
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=report.csv');
        // Generate CSV content
        break;
        
      case 'pdf':
        // Convert report to PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
        // Generate PDF content
        break;
        
      default:
        res.json(report);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete report by ID
export const deleteReport = async (req, res) => {
  try {
    const report = await SalesReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    await report.remove();
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
