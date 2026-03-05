// be/config/db/newHRGA.js

import { Sequelize } from "sequelize";

const newHRGA = new Sequelize('HRGADB', 'AppPIK', 'k02t04dm1n', {
  host: '172.17.100.9',
  dialect: 'mssql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,

  // Gunakan UTC untuk semua operasi, paling aman untuk MSSQL
  timezone: 'Etc/UTC',

  dialectOptions: {
    options: {
      encrypt: true,
      trustServerCertificate: true,
      requestTimeout: 30000,
      connectTimeout: 15000,
      dateFirst: 1,
      useUTC: true // pastikan semua tanggal dikirim/diterima sebagai UTC
    }
  },

  pool: {
    max: 30,
    min: 5,
    acquire: 60000,
    idle: 10000,
    evict: 10000
  },

  retry: {
    max: 3,
    match: [
      /ConnectionError/,
      /ConnectionTimedOutError/,
      /TimeoutError/
    ]
  }
});

newHRGA.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

export default newHRGA;
