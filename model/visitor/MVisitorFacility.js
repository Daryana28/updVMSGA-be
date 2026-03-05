import { Sequelize } from "sequelize";
import newHRGA from "../../config/db/newHRGA.js";

const { DataTypes } = Sequelize;

const MVisitorFacility = newHRGA.define('VISITORFACILITY', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    field: 'ID'
  },
  tokenAttn: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    field: 'TOKENATTENDANCE'
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    field: 'TOKEN'
  },
  facId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'FACID'
  },
}, {
  freezeTableName: true,
  timestamps: false,
  underscored: true
});

export default MVisitorFacility;
