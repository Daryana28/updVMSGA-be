import { Sequelize } from "sequelize";
import newHRGA from "../../config/db/newHRGA.js";

const { DataTypes } = Sequelize;

const MLokerBlock = newHRGA.define('LOCKERBLOCK', {
 BLOCKID: {
  type: DataTypes.STRING,
  primaryKey: true,
  autoIncrement: true
 },
 BLOCK: {
  type: DataTypes.STRING
 },
 ROOM: {
  type: DataTypes.STRING
 },
 ZONE: {
  type: DataTypes.STRING
 },
 ROW: {
  type: DataTypes.STRING
 },
 COL: {
  type: DataTypes.STRING
 },
 STATUS: {
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


export default MLokerBlock;