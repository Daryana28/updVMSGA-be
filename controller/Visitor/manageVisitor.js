import moment from "moment";
import MReqVisitor from "../../model/visitor/MReqVisitor.js";
import MVisitorAttendance from "../../model/visitor/MVisitorAttendance.js";
import MVisitorFacility from "../../model/visitor/MVisitorFacility.js";
import MVisitorImage from "../../model/visitor/MVisitorImage.js";
import MApprovalSteps from "../../model/approval/MApprovalSteps.js";
import MApprovals from "../../model/approval/MApproval.js";
import newHRGA from "../../config/db/newHRGA.js";

export const manageVisitor = async (req, res) => {
 const t = await newHRGA.transaction();
 try {
  // === Parsing body & files ===
  const data =
   typeof req.body.data === "string"
    ? JSON.parse(req.body.data)
    : req.body.data || {};

  const files = Array.isArray(req.files) ? req.files : [];
  const userNik = Number(req.user?.nik ?? 0);

  // === Helper: generate token attendance ===
  const generateTokenAttn = () =>
   `ATN${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  // === Payload utama visitor ===
  const visitorMainPayload = {
   token: data.token,
   startDate: data.startDate
    ? moment(data.startDate).format("YYYY-MM-DD")
    : null,
   endDate: data.endDate
    ? moment(data.endDate).format("YYYY-MM-DD")
    : null,
   startTime: data.startTime ? `${data.startTime}:00` : null,
   endTime: data.endTime ? `${data.endTime}:00` : null,
   perusahaan: data.perusahaan ?? null,
   jenisMeeting: data.jenisMeeting ?? null,
   jumlahTamu: Array.isArray(data.daftar_tamu)
    ? data.daftar_tamu.length
    : 0,
   keperluan: data.keperluan ?? null,
   pic: userNik,
   area_kerja: data.meetingRoom?.value ?? null,
  };

  // === Simpan Visitor utama ===
  const visitor = await MReqVisitor.create(visitorMainPayload, {
   transaction: t,
  });

  // === Data turunan ===
  const attendancesRows = [];
  const facilitiesRows = [];
  const imagesRows = [];
  const fileFields = ["visa", "paspor", "imta", "ktp_scan"];

  if (Array.isArray(data.daftar_tamu)) {
   for (const [index, vst] of data.daftar_tamu.entries()) {
    const tokenAttn = vst.tokenAttn || generateTokenAttn();

    // Attendance
    attendancesRows.push({
     tokenAttn,
     token: data.token,
     nama: vst.nama_tamu ?? null,
     kewarganegaraan: vst.kewarganegaraan ?? null,
     no_paspor: vst.no_paspor ?? null,
     tempat_tinggal: vst.tempat_tinggal ?? null,
     tanggal_mulai: vst.tanggal_mulai ?? null,
     tanggal_selesai: vst.tanggal_selesai ?? null,
    });

    // Facilities
    if (Array.isArray(vst.fasilitas)) {
     for (const fac of vst.fasilitas) {
      facilitiesRows.push({
       token: data.token,
       tokenAttn,
       facId: fac?.value ?? null,
      });
     }
    }

    // Files
    for (const field of fileFields) {
     // Jika local, hanya butuh KTP
     if (vst.kewarganegaraan === "Local" && field !== "ktp_scan") continue;

     const file =
      files.find(
       (f) =>
        f.fieldname === `${field}_${tokenAttn}` ||
        f.fieldname === `${field}_${index}` ||
        f.fieldname === field
      ) || files.find((f) => f.fieldname.startsWith(`${field}_`));

     if (file) {
      imagesRows.push({
       tokenAttn,
       token: data.token,
       name: field,
       files: file.buffer,
       mimeType: file.mimetype,
       originalName: file.originalname,
      });
     }
    }
   }
  }

  // === Bulk insert attendance, facilities, images ===
  if (attendancesRows.length) {
   await MVisitorAttendance.bulkCreate(attendancesRows, { transaction: t });
  }
  if (facilitiesRows.length) {
   await MVisitorFacility.bulkCreate(facilitiesRows, { transaction: t });
  }
  if (imagesRows.length) {
   await MVisitorImage.bulkCreate(imagesRows, { transaction: t });
  }

  // === Cek apakah ada Expatriat ===
  const hasExpatriat = attendancesRows.some(
   (att) => att.kewarganegaraan === "Expatriat"
  );

  // Tentukan batas step_order
  const maxStep = hasExpatriat ? 5 : 4;

  // === Ambil Approval Steps ===
  const approvalSteps = await MApprovalSteps.findAll({
   where: {
    step_order: [...Array(maxStep).keys()].map((i) => i + 1),
    category: 'VISITOR'
   },
   order: [["step_order", "ASC"]],
   raw: true,
  });

  const approvalsRows = approvalSteps.map((step) => {
   let status, dept;

   if (step.step_order === 1) {
    status = "done";
    dept = req.user?.dept || "Unknown";
   } else if (step.step_order === 2) {
    status = "active";
    dept = req.user?.dept || "Unknown";
   } else {
    status = "pending";
    dept = step.dept;
   }

   return {
    step_id: step.id,
    token: data.token,
    step_order: step.step_order,
    role: step.jabatan,
    approver_name: dept,
    status,
   };
  });

  // Bulk insert approvals
  await MApprovals.bulkCreate(approvalsRows, { transaction: t });

  // Commit transaksi
  await t.commit();

  return res.json({
   success: true,
   message: "Visitor berhasil disimpan",
   visitor,
   attendances: attendancesRows,
   facilities: facilitiesRows,
   images: imagesRows,
   approvals: approvalsRows,
  });
 } catch (err) {
  await t.rollback();
  console.error("manageVisitor error:", err);
  return res.status(500).json({
   success: false,
   message: "Gagal menyimpan visitor",
   error: err.message,
  });
 }
};
