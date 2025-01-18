import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

// Initialize the model after sequelize is imported

const Customer = sequelize.define('Customer', {
  customer_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  phone: {
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.JSONB
  },
  registration_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  newsletter_opt_in: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  subscription_status: {
    type: DataTypes.STRING,
    defaultValue: 'unsubscribed'
  }
}, {
  tableName: 'customers',
  timestamps: false
});

// Define associations
Customer.associate = (models) => {
  Customer.hasMany(models.Order, {
    foreignKey: 'customer_id',
    as: 'orders'
  });
};

export default Customer;
