import { Sequelize, DataTypes } from "sequelize";
import newHRGA from "../../config/db/newHRGA.js";

const MApprovals = newHRGA.define('Approvals', {
 id: {
  type: DataTypes.INTEGER,
  primaryKey: true,
  allowNull: false,
  autoIncrement: true,
  autoIncrementIdentity: true
 },
 token: {
  type: DataTypes.STRING,
  allowNull: false,
  validate: {
   notEmpty: true
  }
 },
 step_id: {
  type: DataTypes.STRING,
  allowNull: false,
  validate: {
   notEmpty: true
  }
 },
 step_order: {
  type: DataTypes.STRING,
  allowNull: false,
  validate: {
   notEmpty: true
  }
 },
 role: {
  type: DataTypes.STRING,
  allowNull: true
 },
 approver_name: {
  type: DataTypes.TEXT,
  allowNull: true
 },
 status: {
  type: DataTypes.STRING,
  allowNull: true
 },
 approved_at: {
  type: DataTypes.STRING,
  allowNull: true
 },
 notes: {
  type: DataTypes.STRING,
  allowNull: true
 },
 content: {
  type: DataTypes.STRING,
  allowNull: true
 },
}, {
 tableName: 'Approvals',
 timestamps: false, // Aktifkan agar createdAt dan updatedAt otomatis
 underscored: false, // Sesuaikan dengan format nama kolom di DB
 freezeTableName: true
});

export default MApprovals;
