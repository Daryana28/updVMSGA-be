import { Sequelize } from "sequelize";
import newHRGA from "../../config/db/newHRGA.js";

const { DataTypes } = Sequelize;

const MVisitorAttendance = newHRGA.define('VISITORATTENDANCE', {
 tokenAttn: {
    type: DataTypes.STRING,
    allowNull: true,
    primaryKey: true,
    field: 'tokenAttn'
  },
  token: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'TOKEN'
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  kewarganegaraan: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  no_paspor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  asal_perusahaan: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tempat_tinggal: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tempat_tinggal: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lama_berkunjung: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dari_tanggal: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sampai_tanggal: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tujuan_kunjungan: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tanggal_mulai: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tanggal_selesai: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  freezeTableName: true,
  timestamps: false,
  underscored: true
});

export default MVisitorAttendance;
