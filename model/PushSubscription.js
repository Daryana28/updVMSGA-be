import { DataTypes } from 'sequelize';
import sequelize from '../config/db/newHRGA.js'; 

const PushSubscription = sequelize.define('PushSubscription', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nik: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  endpoint: {
    // PENTING: Jangan gunakan TEXT. MSSQL butuh panjang pasti untuk index/upsert.
    type: DataTypes.STRING(850), 
    allowNull: false,
    unique: true 
  },
  p256dh: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  auth: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'push_subscriptions',
  timestamps: true,
});

export default PushSubscription;