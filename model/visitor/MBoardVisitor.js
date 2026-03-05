import { Sequelize } from "sequelize";
import newHRGA from "../../config/db/newHRGA.js";

const { DataTypes } = Sequelize;

const MBoardVisitor = newHRGA.define('BOARDTAMU', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateStart: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateEnd: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  waktuStart: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  waktuEnd: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tamu: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  freezeTableName: true,
  timestamps: false,
  underscored: false
});

export default MBoardVisitor;
