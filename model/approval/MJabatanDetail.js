import { Sequelize, DataTypes } from "sequelize";
import newHRGA from "../../config/db/newHRGA.js";

const MJabatanDetail = newHRGA.define('Jabatan_Detail', {
 id: {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true
 },
 dept: {
  type: DataTypes.STRING(255),
  allowNull: false
 },
 jabatan: {
  type: DataTypes.STRING(50),
  allowNull: true
 },
 nik: {
  type: DataTypes.STRING(50),
  allowNull: true
 },
}, {
 tableName: 'Jabatan_Detail', // sesuaikan dengan nama tabel di database
 timestamps: false
});

export default MJabatanDetail;
