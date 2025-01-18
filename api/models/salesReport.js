import mongoose from 'mongoose';

const salesReportSchema = new mongoose.Schema({
  date_range: {
    type: {
      start: Date,
      end: Date
    },
    required: true
  },
  total_sales: {
    type: Number,
    required: true
  },
  orders_count: {
    type: Number,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const SalesReport = mongoose.model('SalesReport', salesReportSchema);
export default SalesReport;
