import { DataTypes } from "sequelize";
import newHRGA from "../../config/db/newHRGA.js";

const MPermitImage = newHRGA.define("MPermitImage", {
 id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  worker_index: { type: DataTypes.INTEGER, allowNull: true },
 worker_id: { type: DataTypes.INTEGER, allowNull: true },
 token: { type: DataTypes.STRING(50), allowNull: false },
 name: { type: DataTypes.STRING(100) },
 files: { type: DataTypes.BLOB('long') }, // Varbinary(max)
 mimeType: { type: DataTypes.STRING(50) },
 originalName: { type: DataTypes.STRING(255) },
 file_size: { type: DataTypes.INTEGER },
 // Gunakan DataTypes.DATE untuk kolom DATETIME MSSQL
 createdAt: {
  type: DataTypes.STRING,
  field: 'createdAt'
 },
 updatedAt: {
  type: DataTypes.STRING,
  field: 'updatedAt'
 }
}, {
 tableName: "contractor_image",
 timestamps: false // Kita handle manual atau biarkan true jika kolomnya standard
});

export default MPermitImage;