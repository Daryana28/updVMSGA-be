import { Sequelize, DataTypes } from "sequelize";
import newHRGA from "../config/db/newHRGA.js";

const MUser = newHRGA.define('USER', {
 nik: {
  type: DataTypes.STRING,
  primaryKey: true,
  allowNull: false,
  field: 'NIK'
 },
 nama: {
  type: DataTypes.STRING,
  allowNull: false,
  validate: {
   notEmpty: true
  }
 },
 password: {
  type: DataTypes.STRING,
  allowNull: false,
  validate: {
   notEmpty: true
  }
 },
 token: {
  type: DataTypes.STRING,
  allowNull: true
 },
 refreshToken: {
  type: DataTypes.STRING,
  allowNull: true
 },
 dept: {
  type: DataTypes.STRING,
  allowNull: true
 }
}, {
 tableName: 'USER',
 timestamps: false, // Aktifkan agar createdAt dan updatedAt otomatis
 underscored: false, // Sesuaikan dengan format nama kolom di DB
 freezeTableName: true
});

export default MUser;
