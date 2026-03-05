// be/models/WorkingPermitModel.js
import { Sequelize } from "sequelize";
import db from "../../config/db/localVMS.js";

const { DataTypes } = Sequelize;

const WorkingPermit = db.define('WORKINGPERMIT', {
    TOKEN: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    BULAN: DataTypes.STRING,
    TAHUN: DataTypes.STRING,
    MULAI: DataTypes.DATEONLY,
    AKHIR: DataTypes.DATEONLY,
    JAMMULAI: DataTypes.TIME,
    JAMAKHIR: DataTypes.TIME,
    NOPERMIT: DataTypes.STRING,
    PERUSAHAAN: DataTypes.STRING,
    PEKERJA: {
        type: DataTypes.TEXT,
        get() {
            const rawValue = this.getDataValue('PEKERJA');
            try {
                return rawValue ? JSON.parse(rawValue) : [];
            } catch (e) {
                return [];
            }
        },
        set(value) {
            this.setDataValue('PEKERJA', JSON.stringify(value));
        }
    },
    PEKERJAAN: DataTypes.TEXT,
    LOKASI: DataTypes.TEXT,
    TYPE: DataTypes.STRING,
    PICUSER: DataTypes.STRING,
    PICHSE: DataTypes.STRING,
    RANK: DataTypes.STRING
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});

export default WorkingPermit;