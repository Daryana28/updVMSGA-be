import { Sequelize } from "sequelize";
import newHRGA from "../../config/db/newHRGA.js";

const { DataTypes } = Sequelize;

const MBoardDetail = newHRGA.define('BOARDDETAIL', {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING,
  },
}, {
  freezeTableName: true,
  timestamps: false,
  underscored: true
});

export default MBoardDetail;
