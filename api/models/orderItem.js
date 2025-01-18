import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const OrderItem = sequelize.define('OrderItem', {
  order_item_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'order_id'
    }
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'product_id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'order_items',
  timestamps: false
});

// Define associations
OrderItem.associate = (models) => {
  OrderItem.belongsTo(models.Order, {
    foreignKey: 'order_id',
    as: 'order'
  });
  OrderItem.belongsTo(models.Product, {
    foreignKey: 'product_id',
    as: 'product'
  });
};

export default OrderItem;
