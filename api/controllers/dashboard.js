import Order from '../models/order.js';
import Customer from '../models/customer.js';
import Product from '../models/product.js';

export const getRecentOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      limit: 10,
      order: [['created_at', 'DESC']],
      include: [{
        model: Customer,
        attributes: ['name', 'email'],
        as: 'customerInfo'
      }]
    });

    res.json({
      success: true,
      data: orders.map(order => ({
        id: order.order_id,
        customer: order.customerInfo.name,
        email: order.customerInfo.email,
        total: order.total_amount,
        status: order.status,
        date: order.created_at
      }))
    });
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent orders'
    });
  }
};

export const getDashboardMetrics = async (req, res) => {
  try {
    const [totalProducts, totalCustomers, totalOrders, totalSales] = await Promise.all([
      Product.count(),
      Customer.count(),
      Order.count(),
      Order.sum('total_amount')
    ]);

    res.json({
      success: true,
      data: {
        totalProducts,
        totalCustomers,
        totalOrders,
        totalSales
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard metrics'
    });
  }
};
