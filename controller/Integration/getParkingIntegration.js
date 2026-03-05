import MParkPerm from "../../model/park/MParkPerm.js";
import MMasterPark from "../../model/park/MMasterPark.js";

const MAX_LIMIT = 1000;
const DEFAULT_LIMIT = 200;

const normalizeJenis = (value) => {
  const v = String(value || "").trim().toUpperCase();
  if (v === "MOBIL PRIBADI") return "MOBIL_PRIBADI";
  if (v === "SEPEDA MOTOR") return "SEPEDA_MOTOR";
  if (v === "OPERATIONAL") return "OPERATIONAL";
  return "KOSONG";
};

const normalizeStatus = (value) => {
  const v = String(value || "").trim().toUpperCase();
  if (v === "PERMANEN") return "PERMANEN";
  if (v === "TEMPORARY") return "TEMPORARY";
  return "KOSONG";
};

const parseCursorOffset = (cursor = "") => {
  if (!cursor) return 0;
  try {
    const parsed = JSON.parse(Buffer.from(cursor, "base64").toString("utf-8"));
    const offset = Number(parsed?.offset ?? 0);
    return Number.isFinite(offset) && offset >= 0 ? offset : 0;
  } catch {
    return 0;
  }
};

const buildCursor = (offset) =>
  Buffer.from(JSON.stringify({ offset }), "utf-8").toString("base64");

export const getParkingIntegration = async (req, res) => {
  try {
    const { updated_since: updatedSince, cursor } = req.query;
    const rawLimit = Number(req.query.limit);
    const limit =
      Number.isFinite(rawLimit) && rawLimit > 0
        ? Math.min(rawLimit, MAX_LIMIT)
        : DEFAULT_LIMIT;

    if (updatedSince) {
      const parsed = new Date(updatedSince);
      if (Number.isNaN(parsed.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid updated_since format",
        });
      }
      return res.status(400).json({
        success: false,
        message:
          "updated_since belum didukung karena sumber data parking belum memiliki kolom updated_at yang andal",
      });
    }

    const offset = parseCursorOffset(cursor);

    const allRows = await MParkPerm.findAll({
      raw: true,
      order: [
        ["PARKID", "ASC"],
        ["DISPLAY", "ASC"],
        ["PERMID", "ASC"],
      ],
    });

    const parkIds = [...new Set(allRows.map((r) => r?.PARKID).filter(Boolean))];
    const parkMasters = parkIds.length
      ? await MMasterPark.findAll({
          raw: true,
          where: { PARKID: parkIds },
          attributes: ["PARKID", "NAME"],
        })
      : [];

    const parkNameById = new Map(parkMasters.map((p) => [String(p.PARKID), p.NAME]));

    const mapped = allRows.map((row) => ({
      park_id: String(row.PERMID || `${row.PARKID || "UNKNOWN"}-${row.DISPLAY || "0"}`),
      park_name: parkNameById.get(String(row.PARKID || "")) || null,
      park_number: row.DISPLAY ? String(row.DISPLAY).padStart(3, "0") : null,
      nama: row.nama || null,
      jenis: normalizeJenis(row.JENIS),
      plat_nomor: row.TNKB || "",
      status: normalizeStatus(row.STATUS),
      updated_at: null,
    }));

    const pageData = mapped.slice(offset, offset + limit);
    const nextOffset = offset + pageData.length;
    const nextCursor = nextOffset < mapped.length ? buildCursor(nextOffset) : null;

    return res.status(200).json({
      success: true,
      meta: {
        count: pageData.length,
        limit,
        next_cursor: nextCursor,
        server_time: new Date().toISOString(),
      },
      data: pageData,
    });
  } catch (error) {
    console.error("Error getParkingIntegration:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

