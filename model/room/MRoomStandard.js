// model/room/MRoomStandard.js
import { Sequelize } from "sequelize";
import newHRGA from "../../config/db/newHRGA.js";

const { DataTypes } = Sequelize;

const MRoomStandard = newHRGA.define("ROOMSTANDARD", {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'ID'
  },
  idRom: {
    type: DataTypes.INTEGER,
    field: 'IDROM'
  },
  ITEM: {
    type: DataTypes.STRING,
    field: 'ITEM'
  },
  QTY: {
    type: DataTypes.INTEGER,
    field: 'QTY'
  }
}, {
  freezeTableName: true,
  timestamps: false
});

export default MRoomStandard;