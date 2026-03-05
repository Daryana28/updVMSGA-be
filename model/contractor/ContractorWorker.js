import { DataTypes } from "sequelize";
import newHRGA from "../../config/db/newHRGA.js";
import moment from "moment";

const ContractorWorker = newHRGA.define('ContractorWorker', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  permit_token: { type: DataTypes.STRING(50), allowNull: false },
  nama_pekerja: { type: DataTypes.STRING(255), allowNull: false },
  identitas_no: { type: DataTypes.STRING(50) },
  status_absensi: { type: DataTypes.STRING(20) },
  
  created_at: {
    type: DataTypes.STRING,
    defaultValue: () => moment().format('YYYY-MM-DD HH:mm:ss.SSS')
  },
  updated_at: {
    type: DataTypes.STRING,
    defaultValue: () => moment().format('YYYY-MM-DD HH:mm:ss.SSS')
  }
}, {
  tableName: 'contractor_permit_workers',
  timestamps: false,
});

export default ContractorWorker;