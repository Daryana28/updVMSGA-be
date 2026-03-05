import { Sequelize } from "sequelize";
import localVMS from "../../config/db/localVMS.js";

const { DataTypes } = Sequelize;

const MMasterPark = localVMS.define('MASTERPARK', {
  PARKID: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  NAME: {
    type: DataTypes.STRING
  },
  JENIS: {
    type: DataTypes.STRING
  },
  ROW: {
    type: DataTypes.STRING
  },
  COL: {
    type: DataTypes.STRING
  },
}, {
  freezeTableName: true,
  timestamps: false
});


export default MMasterPark;