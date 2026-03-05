// backend/src/config/db/localVMS.js

import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Memuat variabel lingkungan dari file .env
dotenv.config();

/**
 * Konfigurasi Koneksi Sequelize untuk SQL Server (MSSQL)
 * Menghubungkan ke Database: VMSDB
 * Berdasarkan struktur tabel dbo.WORKINGPERMIT yang telah diidentifikasi sebelumnya.
 */

const localVMS = new Sequelize(
  process.env.DB_NAME || 'VMSDB', 
  process.env.DB_USER || 'AppPIK', 
  process.env.DB_PASS || 'k02t04dm1n', 
  {
    host: process.env.DB_HOST || "172.17.100.9",
    dialect: "mssql",
    logging: false, // Set ke console.log jika ingin melihat query SQL mentah saat debugging
    dialectOptions: {
      options: {
        encrypt: false, // Set ke true jika menggunakan Azure SQL atau koneksi terenkripsi
        trustServerCertificate: true, // Diperlukan untuk sertifikat self-signed pada jaringan lokal
      }
    },
    pool: {
      max: 20,       // Maksimal koneksi simultan
      min: 0,        // Minimal koneksi yang tetap terbuka
      acquire: 30000, // Waktu maksimal (ms) untuk mencoba mendapatkan koneksi sebelum error (30 detik)
      idle: 10000     // Waktu maksimal (ms) sebuah koneksi dibiarkan menganggur sebelum ditutup
    },
  }
);

// Verifikasi koneksi saat aplikasi dijalankan
localVMS.authenticate()
  .then(() => {
    console.log('Connection to MSSQL (VMSDB) has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

export default localVMS;