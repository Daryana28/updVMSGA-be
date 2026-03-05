// model/room/MKategoriRoom.js
import { Sequelize } from "sequelize";
import newHRGA from "../../config/db/newHRGA.js";

const { DataTypes } = Sequelize;

const MKategoriRoom = newHRGA.define('ROOMKATEGORI', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    field: 'ID',
  },
  tabs: {
    type: DataTypes.STRING,
    field: 'TABS',
  },
  kat: {
    type: DataTypes.STRING,
    field: 'KAT',
  },
  show: {
    type: DataTypes.STRING,
    field: 'SHOW',
  },
  createdAt: {
    type: DataTypes.STRING,
    field: 'createdAt',
  },
  updatedAt: {
    type: DataTypes.STRING,
    field: 'updatedAt'
  },
}, {
  freezeTableName: true,
  timestamps: false
});

export default MKategoriRoom;