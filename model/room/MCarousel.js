import { Sequelize } from "sequelize";
import newHRGA from "../../config/db/newHRGA.js";

const { DataTypes } = Sequelize;

const MCarousel = newHRGA.define('ROOMCAROUSEL', {
 id: {
  type: DataTypes.STRING,
  primaryKey: true,
  field: 'ID',
 },
 idRom: {
  type: DataTypes.STRING,
  field: 'IDROM',
 },
 ft: {
  type: DataTypes.STRING,
  field: 'FT',
 },
 Actv: {
  type: DataTypes.STRING,
  field: 'ACTV',
 },
 createdAt: {
  type: DataTypes.STRING,
  field: 'createdAt',
 },
 updatedAt: {
  type: DataTypes.STRING,
  field: 'updatedAt'}
 }
, {
 freezeTableName: true,
 timestamps: false
});


export default MCarousel;