import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
  define: {
    timestamps: false
  }
});

// Test the database connection
sequelize.authenticate()
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection error:', err));

// Export sequelize first
export { sequelize };

// Model initialization function
let models;
let modelsInitialized = false;

export const initializeModels = async () => {
  if (modelsInitialized) return models;
  const Customer = (await import('./models/customer.js')).default;
  const Order = (await import('./models/order.js')).default;
  const Product = (await import('./models/product.js')).default;
  const Logistics = (await import('./models/logistics.js')).default;
  const SalesReport = (await import('./models/salesReport.js')).default;
  const OrderItem = (await import('./models/orderItem.js')).default;

  models = {
    Customer,
    Order,
    Product,
    Logistics,
    SalesReport,
    OrderItem
  };
navigationLinks:

  // Load associations
  Object.values(models).forEach(model => {
    if (model.associate) {
      model.associate(models);
    }
  });

  modelsInitialized = true;
  return models;
};

// Export models getter
export const getModels = () => {
  if (!modelsInitialized) {
    throw new Error('Models not initialized. Call initializeModels() first.');
  }
  return models;
};
