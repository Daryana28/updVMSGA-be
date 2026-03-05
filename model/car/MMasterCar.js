import { Sequelize } from "sequelize";
import newHRGA from "../../config/db/newHRGA.js";

const { DataTypes } = Sequelize;

const MMasterCar = newHRGA.define('CARMASTER', {
 carId: {
  type: DataTypes.STRING,
  primaryKey: true,
  field: 'CARID',
  autoIncrementIdentity: true,
  autoIncrement: true
 },
 supplier: {
  type: DataTypes.STRING,
  allowNull: true,
  field: 'SUPPLIER'
 },
 tnkb: {
  type: DataTypes.STRING,
  allowNull: true,
  field: 'TNKB'
 },
 merk: {
  type: DataTypes.STRING,
  allowNull: true,
  field: 'MERK'
 },
 kapasitas: {
  type: DataTypes.STRING,
  allowNull: true,
  field: 'KAPASITAS'
 },
 driver: {
  type: DataTypes.STRING,
  allowNull: true,
  field: 'DRIVER'
 },
 status: {
  type: DataTypes.STRING,
  allowNull: true,
  field: 'STATUS'
 },
}, {
 freezeTableName: true,
 timestamps: false,
 underscored: true
});

export default MMasterCar;
