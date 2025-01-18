import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const Logistics = sequelize.define('Logistics', {
  partner_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  region: {
    type: DataTypes.STRING
  },
  contact_details: {
    type: DataTypes.JSONB
  }
}, {
  tableName: 'logistics_partners',
  timestamps: false
});

export default Logistics;
