import { Sequelize } from "sequelize";
import newHRGA from "../../config/db/newHRGA.js";

const { DataTypes } = Sequelize;

const MReqCar = newHRGA.define('CARREQUEST', {
  requestToken: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: true,
    field: 'REQUEST_TOKEN'
  },
  tokenKomo: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'TOKENKOMO'
  },
  date: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'DATE'
  },
  carId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'CARID'
  },
  penumpang: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'PENUMPANG'
  },
  min: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'MIN'
  },
  max: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'MAX'
  },
  perihal: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'PERIHAL'
  },
  tujuan: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'TUJUAN'
  },
  nik: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'NIK'
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'STATUS'
  },
  userNIK: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'NIK'
  },
}, {
  freezeTableName: true,
  timestamps: false,
  underscored: true
});

export default MReqCar;
