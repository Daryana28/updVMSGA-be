// be/model/approval/MApprovalSteps.js
import { Sequelize, DataTypes } from "sequelize";
import newHRGA from "../../config/db/newHRGA.js";

const MApprovalSteps = newHRGA.define('Approval_Steps', {
 id: {
  type: DataTypes.INTEGER,
  primaryKey: true,
  allowNull: false,
 },
 step_order: {
  type: DataTypes.INTEGER,
  allowNull: false,
 },
 approver_name: {
  type: DataTypes.STRING,
  allowNull: true
 },
 status: {
  type: DataTypes.STRING,
  allowNull: true
 },
 description: {
  type: DataTypes.STRING,
  allowNull: true
 },
 jabatan: {
  type: DataTypes.STRING,
  allowNull: true
 },
 dept: {
  type: DataTypes.STRING,
  allowNull: true
 },
 category: { // TAMBAHKAN INI
  type: DataTypes.STRING,
  allowNull: true
 },
}, {
 tableName: 'Approval_Steps',
 timestamps: false,
 freezeTableName: true
});

export default MApprovalSteps;