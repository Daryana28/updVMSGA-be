import { Sequelize } from "sequelize";
import newHRGA from "../../config/db/newHRGA.js";

const { DataTypes } = Sequelize;

const MMasterRoomStandard = newHRGA.define("ROOMMASTERSTANDARD", {
 stdId: {
  type: DataTypes.STRING,
  primaryKey: true,
  allowNull: false,
  autoIncrement: true,
  field: 'STDID'
 },
 standard: {
  type: DataTypes.STRING,
  allowNull: false,
  field: 'STANDARD'
 },
 kategori: {
  type: DataTypes.STRING,
  allowNull: false,
  field: 'KATEGORI'
 },
 createdAt: {
  type: DataTypes.DATE,
  allowNull: true,
  field: 'createdAt'
 },
 updatedAt: {
  type: DataTypes.DATE,
  allowNull: true,
  field: 'updatedAt'
 }
}, {
 freezeTableName: true,
 timestamps: false
});

MMasterRoomStandard.associate = (models) => {
 models.MMasterRoomStandard.hasMany(models.MRoomStandard, {
  foreignKey: "item",
  sourceKey: "standard",
  as: "roomStandards"
 });
};


export default MMasterRoomStandard;
