import { Sequelize } from "sequelize";
import localVMS from "../../config/db/localVMS.js";

const { DataTypes } = Sequelize;

const MParkPerm = localVMS.define('MASTERPERM', {
 PERMID: {
  type: DataTypes.STRING,
  primaryKey: true,
  autoIncrement: true
 },
 PARKID: {
  type: DataTypes.STRING
 },
 DISPLAY: {
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
 CARDID: {
  type: DataTypes.STRING
 },
 TNKB: {
  type: DataTypes.STRING
 },
 JENIS: {
  type: DataTypes.STRING
 },
 STATUS: {
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


export default MParkPerm;