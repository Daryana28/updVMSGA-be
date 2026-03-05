import { Sequelize } from "sequelize";
import newHRGA from "../../config/db/newHRGA.js";

const { DataTypes } = Sequelize;

const MVisitorImage = newHRGA.define(
 "VISITORIMAGE",
 {
  id: {
   type: DataTypes.INTEGER, // ✅ harus integer untuk autoIncrement
   allowNull: false,
   autoIncrement: true,
   primaryKey: true,
   field: "ID",
  },
  tokenAttn: {
   type: DataTypes.STRING,
   allowNull: false,
   field: "TOKENATTENDANCE",
  },
  token: {
   type: DataTypes.STRING,
   allowNull: false,
   field: "TOKEN",
  },
  files: {
   type: DataTypes.BLOB("long"), // ✅ binary
   allowNull: true,
   field: "FILES", // pastikan di DB kolomnya ada
  },
  image: {
   type: DataTypes.STRING,
   allowNull: true,
   field: "IMAGE", // kalau memang ada kolom image (misal path/file lama)
  },
  mimeType: {
   type: DataTypes.STRING,
   allowNull: true,
   field: "MIMETYPE", // ✅ harus kolom sendiri
  },
  name: {
   type: DataTypes.STRING,
   allowNull: true,
   field: "NAME",
  },
  originalName: {
   type: DataTypes.STRING,
   allowNull: true,
   field: "ORIGINALNAME", // ✅ harus kolom sendiri
  },
 },
 {
  freezeTableName: true,
  timestamps: false,
  underscored: true,
 }
);

export default MVisitorImage;
