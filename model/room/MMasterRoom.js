// model/room/MMasterRoom.js
import { Sequelize } from "sequelize";
import newHRGA from "../../config/db/newHRGA.js";

const { DataTypes } = Sequelize;

const MMasterRoom = newHRGA.define("ROOMMASTER", {
  roomId: {
    type: DataTypes.INTEGER, // Biasa INT di SQL Server
    primaryKey: true,
    autoIncrement: true,
    field: 'ROOMID'
  },
  nama: {
    type: DataTypes.STRING,
    field: 'NAMA'
  },
  category: {
    type: DataTypes.STRING,
    field: 'CATEGORY'
  },
  kapasitas: {
    type: DataTypes.STRING,
    field: 'KAPASITAS'
  },
  location: {
    type: DataTypes.STRING,
    field: 'LOCATION'
  },
  status: { // Tambahkan ini jika ada di DB untuk Badge "Ready"
    type: DataTypes.STRING,
    field: 'SHOW'
  }
}, {
  freezeTableName: true,
  timestamps: false // Set true jika ada kolom createdAt & updatedAt
});

export default MMasterRoom;