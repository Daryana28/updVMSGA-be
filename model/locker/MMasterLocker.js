import { Sequelize } from "sequelize";
import newHRGA from "../../config/db/newHRGA.js";

const { DataTypes } = Sequelize;

const MMasterLoker = newHRGA.define('LOCKERMASTER', {
 LOCKERID: {
  type: DataTypes.STRING,
  primaryKey: true,
  autoIncrement: true
 },
 ZONE: {
  type: DataTypes.STRING
 },
 BLOCKID: {
  type: DataTypes.STRING
 },
 STAND: {
  type: DataTypes.STRING
 },
 PATH: {
  type: DataTypes.STRING
 },
 NAME: {
  type: DataTypes.STRING
 },
 NIK: {
  type: DataTypes.STRING
 },
 NAMA: {
  type: DataTypes.STRING
 },
 DEPT: {
  type: DataTypes.STRING
 },
 STATUS_KARYAWAN: {
  type: DataTypes.STRING
 },
 STATUS_LOKER: {
  type: DataTypes.STRING
 },
 createdAt: {
  type: DataTypes.STRING
 },
 updatedAt: {
  type: DataTypes.STRING
 },
}, {
 freezeTableName: true,
 timestamps: false
});


export default MMasterLoker;