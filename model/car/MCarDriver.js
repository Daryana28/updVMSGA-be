import { DataTypes } from "sequelize";
import newHRGA from "../../config/db/newHRGA.js";

const MCarDriver = newHRGA.define("MCarDriver", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  carId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  driverId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: "CARDRIVER",
  timestamps: false,
});

export default MCarDriver;
