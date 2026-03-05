import { Sequelize } from "sequelize";
import hris from "../config/db/HRIS.js";

const {DataTypes} = Sequelize;

const MVHU = hris.define('VHU',{
 NoPegawai:{
  type: DataTypes.STRING,
  primaryKey: true
 },
 Nama:{
  type: DataTypes.STRING
 },
 DEPT:{
  type: DataTypes.STRING
 },
 DIVISI:{
  type: DataTypes.STRING
 },
 Golongan_ID:{
  type: DataTypes.STRING
 },
 JabatanFunc:{
  type: DataTypes.STRING
 },
 JenisBerhenti_ID:{
  type: DataTypes.STRING
 },
 Tgl_Berhenti:{
  type: DataTypes.STRING
 },
 StatusKerja:{
  type: DataTypes.STRING
 },
 Berlaku_sdgn:{
  type: DataTypes.STRING
 }
},{
  freezeTableName: true,
  timestamps: false
});


export default MVHU;