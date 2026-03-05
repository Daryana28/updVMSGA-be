import { DataTypes } from "sequelize";
import newHRGA from "../../config/db/newHRGA.js";

const ContractorPermit = newHRGA.define("ContractorPermit", {
 id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
 token: { type: DataTypes.STRING(50), allowNull: false, unique: true },
 no_permit: { type: DataTypes.STRING(100) },
 bulan: { type: DataTypes.STRING(20) },
 perusahaan: { type: DataTypes.STRING(255), allowNull: false },
 tipe_pekerjaan: { type: DataTypes.STRING(50), defaultValue: "Reguler" },
 pekerjaan: { type: DataTypes.TEXT },
 lokasi: { type: DataTypes.STRING(255) },

 tgl_mulai: { type: DataTypes.STRING, allowNull: false },
 tgl_akhir: { type: DataTypes.STRING, allowNull: false },

 jam_mulai: { type: DataTypes.STRING, defaultValue: "08:00:00" },
 jam_akhir: { type: DataTypes.STRING, defaultValue: "17:00:00" },

 daftar_pekerja: {
  type: DataTypes.TEXT,
  set(val) { this.setDataValue('daftar_pekerja', val ? JSON.stringify(val) : null); },
  get() {
   const val = this.getDataValue('daftar_pekerja');
   try { return val ? JSON.parse(val) : null; }
   catch { return val; }
  }
 },

 pic_user: { type: DataTypes.STRING(150) },
 pic_hse: { type: DataTypes.STRING(150) },
 created_by: { type: DataTypes.STRING(100) },
 is_security_committed: { type: DataTypes.BOOLEAN, defaultValue: false },
 needs_special_qualification: { type: DataTypes.BOOLEAN, defaultValue: false },

 created_at: { type: DataTypes.STRING},
 updated_at: { type: DataTypes.STRING}
}, {
 tableName: "contractor_permits",
 timestamps: false
});

export default ContractorPermit;
