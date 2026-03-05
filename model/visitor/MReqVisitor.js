import { Sequelize } from "sequelize";
import newHRGA from "../../config/db/newHRGA.js";

const { DataTypes } = Sequelize;

// Definisi model MReqVisitor dengan optimasi tipe data dan validasi
const MReqVisitor = newHRGA.define('VISITORREQ', {
  token: {
    type: DataTypes.STRING(64),
    primaryKey: true,
    allowNull: false,
    field: 'TOKEN',
    validate: {
      notEmpty: true
    }
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'STARTDATE',
    validate: {
      isDate: true,
      notEmpty: true
    }
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'ENDDATE',
    validate: {
      isDate: true,
      notEmpty: true
    }
  },
  startTime: {
    type: DataTypes.STRING(10),
    allowNull: false,
    field: 'STARTTIME',
    validate: {
      notEmpty: true
    }
  },
  endTime: {
    type: DataTypes.STRING(10),
    allowNull: false,
    field: 'ENDTIME',
    validate: {
      notEmpty: true
    }
  },
  perusahaan: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'PERUSAHAAN',
    validate: {
      notEmpty: true
    }
  },
  jenisMeeting: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'JENISMEETING',
    validate: {
      notEmpty: true
    }
  },
  jumlahTamu: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'JMLTAMU',
    validate: {
      isInt: true,
      min: 1
    }
  },
  keperluan: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'KEPERLUAN',
  },
  pic: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'PIC',
    validate: {
      notEmpty: true
    }
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'STATUS',
    validate: {
      notEmpty: false
    }
  },
  area_kerja: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'AREAKERJA',
    validate: {
      notEmpty: true
    }
  },
  welcomeBoard: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'WELCOMEBOARD',
    validate: {
      notEmpty: true
    }
  },
}, {
  freezeTableName: true,
  timestamps: false,
  underscored: true
});

export default MReqVisitor;
