import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const Order = sequelize.define('Order', {
  order_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'customers',
      key: 'customer_id'
    }
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'orders',
  timestamps: false
});

// Define associations
Order.associate = (models) => {
  Order.belongsTo(models.Customer, {
    foreignKey: 'customer_id',
    as: 'customerInfo'
  });
};

export default Order;
