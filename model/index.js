// PATH: be/model/index.js
import Sequelize from "sequelize";
import newHRGA from "../config/db/newHRGA.js";

/* ========== Import Models ========== */
import MKategoriRoom from "./room/MKategoriRoom.js";
import MMasterRoom from "./room/MMasterRoom.js";
import MRoomStandard from "./room/MRoomStandard.js";
import MMasterRoomStandard from "./room/MMasterRoomStandard.js";
import MCarousel from "./room/MCarousel.js";
import MRequestRoom from "./room/MRequestRoom.js";

import MUser from "./MUser.js";

import MReqVisitor from "./visitor/MReqVisitor.js";
import MVisitorAttendance from "./visitor/MVisitorAttendance.js";
import MVisitorFacility from "./visitor/MVisitorFacility.js";
import MVisitorImage from "./visitor/MVisitorImage.js";

import MMasterTime from "./time/MMasterTime.js";

import MMasterCar from "./car/MMasterCar.js";
import MReqCar from "./car/MReqCar.js";
import MMasterDriver from "./driver/MMasterDriver.js";
import MCarDriver from "./car/MCarDriver.js";

import MApprovalSteps from "./approval/MApprovalSteps.js";
import MApprovals from "./approval/MApproval.js";
import MJabatan from "./approval/MJabatan.js";
import MJabatanDetail from "./approval/MJabatanDetail.js";
import MBoardVisitor from "./visitor/MBoardVisitor.js";
import MBoardDetail from "./visitor/MBoardDetail.js";

import ContractorPermit from "./contractor/ContractorPermit.js";
import ContractorWorker from "./contractor/ContractorWorker.js";
import MPermitImage from "./contractor/MPermitImage.js";

/* ========== Init DB Object ========== */
const db = {
  Sequelize,
  sequelize: newHRGA,
  MKategoriRoom,
  MMasterRoom,
  MRoomStandard,
  MMasterRoomStandard,
  MCarousel,
  MRequestRoom,
  MUser,
  MReqVisitor,
  MVisitorAttendance,
  MVisitorFacility,
  MVisitorImage,
  MMasterTime,
  MMasterCar,
  MReqCar,
  MMasterDriver,
  MCarDriver,
  MApprovalSteps,
  MApprovals,
  MJabatan,
  MJabatanDetail,
  MBoardVisitor,
  MBoardDetail,
  ContractorPermit,
  ContractorWorker,
  MPermitImage,
};

/* ========== Associations ========== */

/* --- Room Associations --- */
MKategoriRoom.hasMany(MMasterRoom, { foreignKey: "category", sourceKey: "tabs", as: "rooms" });
MMasterRoom.belongsTo(MKategoriRoom, { foreignKey: "category", targetKey: "tabs", as: "kategoriRoom" });
MMasterRoom.hasMany(MRoomStandard, { foreignKey: "idRom", sourceKey: "roomId", as: "facilities" });
MRoomStandard.belongsTo(MMasterRoom, { foreignKey: "idRom", targetKey: "roomId", as: "room" });
MMasterRoom.hasMany(MRequestRoom, { foreignKey: "ROOMID", sourceKey: "roomId", as: "requests" });
MRequestRoom.belongsTo(MMasterRoom, { foreignKey: "ROOMID", targetKey: "roomId", as: "room" });

/* --- User & Visitor --- */
MUser.hasMany(MReqVisitor, { foreignKey: "pic", sourceKey: "nik", as: "reqVisitors" });
// Perbaikan: MReqVisitor belongsTo MUser alias "user"
MReqVisitor.belongsTo(MUser, { foreignKey: "pic", targetKey: "nik", as: "user" });
MReqVisitor.hasMany(MVisitorAttendance, { foreignKey: "token", sourceKey: "token", as: "attendances" });
MVisitorAttendance.belongsTo(MReqVisitor, { foreignKey: "token", targetKey: "token", as: "requestVisitor" });
MReqVisitor.hasMany(MVisitorFacility, { foreignKey: "token", sourceKey: "token", as: "facilities" });
MVisitorFacility.belongsTo(MReqVisitor, { foreignKey: "token", targetKey: "token", as: "request" });
MReqVisitor.hasMany(MApprovals, { foreignKey: "token", sourceKey: "token", as: "approvals" });
MApprovals.belongsTo(MReqVisitor, { foreignKey: "token", targetKey: "token", as: "request" });
MReqVisitor.belongsTo(MMasterRoom, { foreignKey: "area_kerja", targetKey: "roomId", as: "room" });
MMasterRoom.hasMany(MReqVisitor, { foreignKey: "area_kerja", sourceKey: "roomId", as: "reqVisitors" });
MVisitorAttendance.hasMany(MVisitorFacility, { foreignKey: "tokenAttn", sourceKey: "tokenAttn", as: "facilities" });
MVisitorFacility.belongsTo(MVisitorAttendance, { foreignKey: "tokenAttn", targetKey: "tokenAttn", as: "attendance" });
MVisitorFacility.belongsTo(MMasterRoomStandard, { foreignKey: "facId", targetKey: "stdId", as: "roomStandard" });
MMasterRoomStandard.hasMany(MVisitorFacility, { foreignKey: "facId", sourceKey: "stdId", as: "visitorFacilities" });
MVisitorAttendance.hasMany(MVisitorImage, { foreignKey: "tokenAttn", as: "images" });
MVisitorImage.belongsTo(MVisitorAttendance, { foreignKey: "tokenAttn", as: "attendance" });

/* --- Car & Driver --- */
MMasterDriver.hasMany(MCarDriver, { foreignKey: "driverId", sourceKey: "driverId", as: "linkedDriver" });
MCarDriver.belongsTo(MMasterDriver, { foreignKey: "driverId", targetKey: "driverId", as: "driverLinked" });
MMasterCar.hasMany(MCarDriver, { foreignKey: "carId", sourceKey: "carId", as: "linkedCar" });
MCarDriver.belongsTo(MMasterCar, { foreignKey: "carId", targetKey: "carId", as: "carLinked" });
MMasterCar.hasMany(MReqCar, { foreignKey: "carId", sourceKey: "carId", as: "reqCars" });
MReqCar.belongsTo(MMasterCar, { foreignKey: "carId", targetKey: "carId", as: "car" });
MUser.hasMany(MReqCar, { foreignKey: "userNIK", sourceKey: "nik", as: "reqCars" });
MReqCar.belongsTo(MUser, { foreignKey: "userNIK", targetKey: "nik", as: "user" });

/* --- Approval --- */
MUser.hasMany(MApprovalSteps, { foreignKey: "status", sourceKey: "nik", as: "approvalSteps" });
MApprovalSteps.belongsTo(MUser, { foreignKey: "status", targetKey: "nik", as: "approver" });
MApprovalSteps.hasMany(MApprovals, { foreignKey: "step_order", sourceKey: "step_order", as: "approvals" });
MApprovals.belongsTo(MApprovalSteps, { foreignKey: "step_order", targetKey: "step_order", as: "approvalStep" });
MApprovalSteps.belongsTo(MJabatan, { foreignKey: "jabatan", targetKey: "sect_head", as: "jabatanSect" });
MJabatan.hasMany(MApprovalSteps, { foreignKey: "jabatan", sourceKey: "sect_head", as: "approvalSteps" });
MUser.hasMany(MApprovals, { foreignKey: "approver_name", sourceKey: "nik", as: "approvals" });
MApprovals.belongsTo(MUser, { foreignKey: "approver_name", targetKey: "nik", as: "approver" });
MJabatan.hasMany(MJabatanDetail, { foreignKey: "dept", sourceKey: "dept", as: "JabatanDetails" });
MJabatanDetail.belongsTo(MJabatan, { foreignKey: "dept", targetKey: "dept", as: "DetailsJabatan" });
MJabatanDetail.belongsTo(MUser, { foreignKey: "nik", targetKey: "nik", as: "userDetailJabat" });
MUser.hasMany(MJabatanDetail, { foreignKey: "nik", sourceKey: "nik", as: "detailJabatUser" });
MJabatan.belongsTo(MUser, { foreignKey: "sect_head", targetKey: "nik", as: "sectHead" });
MJabatan.belongsTo(MUser, { foreignKey: "dept_head", targetKey: "nik", as: "deptHead" });
MJabatan.belongsTo(MUser, { foreignKey: "div_head", targetKey: "nik", as: "divHead" });
MUser.hasMany(MJabatan, { foreignKey: "sect_head", sourceKey: "nik", as: "sectJabatans" });
MUser.hasMany(MJabatan, { foreignKey: "dept_head", sourceKey: "nik", as: "deptJabatans" });
MUser.hasMany(MJabatan, { foreignKey: "div_head", sourceKey: "nik", as: "divJabatans" });
MApprovals.hasMany(MJabatanDetail, { foreignKey: "jabatan", sourceKey: "role", as: "jabatanDetails" });
MJabatanDetail.belongsTo(MApprovals, { foreignKey: "jabatan", targetKey: "role", as: "approval" });
MBoardVisitor.hasMany(MBoardDetail, { foreignKey: "token", sourceKey: "token", as: "BoardDetails" });
MBoardDetail.belongsTo(MBoardVisitor, { foreignKey: "token", targetKey: "token", as: "visitorBoard" });

/* --- Contractor Associations --- */
ContractorPermit.hasMany(ContractorWorker, { foreignKey: "permit_token", sourceKey: "token", as: "workers", onDelete: "CASCADE" });
ContractorWorker.belongsTo(ContractorPermit, { foreignKey: "permit_token", targetKey: "token", as: "permit" });

// Worker → Images
ContractorWorker.hasMany(MPermitImage, { foreignKey: "worker_id", sourceKey: "id", as: "images", onDelete: "CASCADE" });
MPermitImage.belongsTo(ContractorWorker, { foreignKey: "worker_id", targetKey: "id", as: "worker" });

// ContractorPermit → User (Creator)
MUser.hasMany(ContractorPermit, { foreignKey: "created_by", sourceKey: "nik", as: "contractorPermits" });
ContractorPermit.belongsTo(MUser, { foreignKey: "created_by", targetKey: "nik", as: "user" });

// ContractorPermit → PIC (Detail Users)
ContractorPermit.belongsTo(MUser, { foreignKey: "pic_user", targetKey: "nik", as: "picUserDetail" });
ContractorPermit.belongsTo(MUser, { foreignKey: "pic_hse", targetKey: "nik", as: "picHseDetail" });

// ContractorPermit → Approvals
ContractorPermit.hasMany(MApprovals, { foreignKey: "token", sourceKey: "token", as: "approvals" });
MApprovals.belongsTo(ContractorPermit, { foreignKey: "token", targetKey: "token", as: "contractorPermit" });

// ContractorPermit → Images level permit (opsional)
ContractorPermit.hasMany(MPermitImage, { foreignKey: "token", sourceKey: "token", as: "imagesPermit", onDelete: "CASCADE" });
MPermitImage.belongsTo(ContractorPermit, { foreignKey: "token", targetKey: "token", as: "permit" });

/* ========== Run associate() ========== */
Object.values(db).forEach((model) => {
  if (model?.associate) model.associate(db);
});

export { ContractorPermit, ContractorWorker, MPermitImage };
export default db;