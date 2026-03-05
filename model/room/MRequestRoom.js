import { Sequelize } from "sequelize";
import newHRGA from "../../config/db/newHRGA.js";

const { DataTypes } = Sequelize;

const MRequestRoom = newHRGA.define('roomrequest', {
  request_token: {
    type: DataTypes.STRING,
    primaryKey: true,
    field: "REQUEST_TOKEN"
  },
  roomid: {
    type: DataTypes.STRING,
    field: "ROOMID"
  },
  tanggal: {
    type: DataTypes.STRING,
    field: 'TANGGAL'
  },
  facility: {
    type: DataTypes.STRING,
    field: 'FACILITY'
  },
  peserta: {
    type: DataTypes.STRING,
    field: 'PESERTA'
  },
  nik: {
    type: DataTypes.STRING,
    field: 'NIK'
  },
  min: {
    type: DataTypes.STRING,
    field: 'MIN'
  },
  max: {
    type: DataTypes.STRING,
    field: 'MAX'
  },
  subject: {
    type: DataTypes.STRING,
    field: 'SUBJECT'
  },
  perusahaan: {
    type: DataTypes.STRING,
    field: 'PERUSAHAAN'
  },
  qty: {
    type: DataTypes.INTEGER,
    field: 'QTY'
  },
  status: {
    type: DataTypes.STRING,
    field: 'STATUS'
  }
}, {
  freezeTableName: true,
  timestamps: false
});

MRequestRoom.associate = (models) => {
  // Relasi: USER memiliki banyak ROOMREQUEST
  models.MUser.hasMany(models.MRequestRoom, {
    foreignKey: 'nik',
    sourceKey: 'nik',
    as: 'roomRequests'
  });

  // Relasi: ROOMREQUEST dimiliki oleh satu USER
  models.MRequestRoom.belongsTo(models.MUser, {
    foreignKey: 'nik',
    targetKey: 'nik',
    as: 'user'
  });
};

export default MRequestRoom;
