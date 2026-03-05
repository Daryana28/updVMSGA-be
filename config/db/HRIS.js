import { Sequelize } from "sequelize";

const hris = new Sequelize('SPISY_KOITO', 'sa', 'p@55w0rd', {
 host: "172.17.100.6",
 port: '56646',
 dialect: "mssql",
 pool: {
  max: 20,
  min: 0,
  acquire: 60000,
  idle: 10000
 }
})

export default hris;