import { Sequelize } from "sequelize";
import newHRGA from "../../config/db/newHRGA.js";

const { DataTypes } = Sequelize;

const MKategoriLoker = newHRGA.define('LOCKERKATEGORI', {
 ID: {
  type: DataTypes.STRING,
  primaryKey: true
 },
 ZONE: {
  type: DataTypes.STRING
 },
 NAME: {
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


export default MKategoriLoker;