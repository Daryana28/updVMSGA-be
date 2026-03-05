import { Sequelize } from "sequelize";
import newHRGA from "../../config/db/newHRGA.js";

const { DataTypes } = Sequelize;

const MMasterDriver = newHRGA.define('DRIVERMASTER', {
 driverId: {
  type: DataTypes.STRING,
  field: 'DRIVERID',
  primaryKey: true,
  autoIncrement: true,
  autoIncrementIdentity: true
 },
 carId: {
  type: DataTypes.STRING,
  field: 'CARID'
 },
 supplier: {
  type: DataTypes.STRING,
  field: 'SUPPLIER'
 },
 nama: {
  type: DataTypes.STRING,
  field: 'NAMA'
 },
 tlp: {
  type: DataTypes.STRING,
  field: 'TLP'
 },
 alamat: {
  type: DataTypes.STRING,
  field: 'ALAMAT'
 },
 createdAt: {
  type: DataTypes.STRING,
  field: 'createdAt'
 },
 updatedAt: {
  type: DataTypes.STRING,
  field: 'updatedAt'
 },
}, {
 freezeTableName: true,
 timestamps: false,
 underscored: true
});

export default MMasterDriver;
