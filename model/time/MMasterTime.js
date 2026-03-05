import { Sequelize } from "sequelize";
import newHRGA from "../../config/db/newHRGA.js";

const { DataTypes } = Sequelize;

const MMasterTime = newHRGA.define('TIMEMASTER', {
  timeid: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    field: 'TIMEID'
  },
  time_start: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'TIME_START'
  },
  time_end: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'TIME_END'
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'createdAt'
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'updatedAt'
  }
}, {
  freezeTableName: true,
  timestamps: false,
  underscored: true
});

export default MMasterTime;
