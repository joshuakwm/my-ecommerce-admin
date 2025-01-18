import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const Product = sequelize.define('Product', {
  product_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  stock_quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  description: {
    type: DataTypes.TEXT
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  image_url: {
    type: DataTypes.TEXT
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'products',
  timestamps: false
});

// Define associations
Product.associate = (models) => {
  Product.hasMany(models.OrderItem, {
    foreignKey: 'product_id',
    as: 'order_items'
  });
};

export default Product;
