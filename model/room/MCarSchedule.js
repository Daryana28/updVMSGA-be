import { Sequelize } from "sequelize";
import localGA from "../config/database/LocalGA.js";

const { DataTypes } = Sequelize;

const MCarSchedule = localGA.define('carschedule', {
  token: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  driver: {
    type: DataTypes.STRING
  },
  min: {
    type: DataTypes.STRING
  },
  max: {
    type: DataTypes.STRING
  },
  start: {
    type: DataTypes.STRING
  },
  end: {
    type: DataTypes.STRING
  },
  pic: {
    type: DataTypes.STRING
  },
  nik: {
    type: DataTypes.STRING
  },
  dept: {
    type: DataTypes.STRING
  },
  tgl: {
    type: DataTypes.STRING
  },
  tujuan: {
    type: DataTypes.STRING
  },
  perihal: {
    type: DataTypes.STRING
  },
  stat: {
    type: DataTypes.STRING
  },
}, {
  freezeTableName: true,
  timestamps: false
});


export default MCarSchedule;