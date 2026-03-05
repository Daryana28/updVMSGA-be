import { Sequelize, DataTypes } from "sequelize";
import newHRGA from "../../config/db/newHRGA.js";

const MJabatan = newHRGA.define('Jabatan', {
 id: {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true
 },
 dept: {
  type: DataTypes.STRING(255),
  allowNull: false
 },
 sect_head: {
  type: DataTypes.STRING(50),
  allowNull: true
 },
 dept_head: {
  type: DataTypes.INTEGER,
  allowNull: true
 },
 div_head: {
  type: DataTypes.STRING(50),
  allowNull: true
 },
 createdAt: {
  type: DataTypes.DATE,
  allowNull: false,
  defaultValue: DataTypes.NOW
 },
 updatedAt: {
  type: DataTypes.DATE,
  allowNull: false,
  defaultValue: DataTypes.NOW
 }
}, {
 tableName: 'Jabatan', // sesuaikan dengan nama tabel di database
 timestamps: true
});

export default MJabatan;
