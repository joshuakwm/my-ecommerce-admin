import { sequelize } from '../db.js';
import Order from './order.js';
import Customer from './customer.js';
import Product from './product.js';

export const getDashboardStats = async () => {
  const [totalProducts, totalCustomers, totalOrders, totalSales] = await Promise.all([
    Product.count(),
    Customer.count(),
    Order.count(),
    Order.sum('total_amount')
  ]);

  return {
    totalProducts,
    totalCustomers,
    totalOrders,
    totalSales: totalSales || 0
  };
};

export const getRecentOrders = async (limit = 5) => {
  const orders = await Order.findAll({
    limit,
    order: [['created_at', 'DESC']],
    include: [{
      model: Customer,
      attributes: ['name']
    }],
    attributes: [
      'order_id',
      'total_amount',
      'created_at',
      'status',
      [db.col('customer.name'), 'customer_name']
    ]
  });

  return orders.map(order => ({
    ...order.toJSON(),
    total_amount: parseFloat(order.total_amount),
    created_at: new Date(order.created_at).toLocaleString()
  }));
};
