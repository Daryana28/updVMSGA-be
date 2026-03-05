import { Sequelize } from "sequelize";
import localVMS from "../../config/localVMS.js";

const { DataTypes } = Sequelize;

const MLotPark = localVMS.define('PARKINGLOT', {
  ID: {
    type: DataTypes.STRING,
    primaryKey: true,
    autoIncrement: true
  },
  DISPLAY: {
    type: DataTypes.STRING
  },
  PARKID: {
    type: DataTypes.STRING
  },
  CARDID: {
    type: DataTypes.STRING
  },
  JENIS: {
    type: DataTypes.STRING
  },
  STATUS: {
    type: DataTypes.STRING
  },
  TOKEN: {
    type: DataTypes.STRING
  },
  nik: {
    type: DataTypes.STRING,
    field: 'NIK'
  },
  nama: {
    type: DataTypes.STRING,
    field: 'NAMA'
  },
  TNKB: {
    type: DataTypes.STRING
  },
  MULAI: {
    type: DataTypes.STRING
  },
  AKHIR: {
    type: DataTypes.STRING
  },
}, {
  freezeTableName: true,
  timestamps: false
});


export default MLotPark;