import { FindLokeBlockByRoom } from "./FindLokeBlockByRoom.js";
import MMasterLoker from "../../model/locker/MMasterLocker.js";
import MVHU from "../../model/MBtkVHU.js";
import moment from "moment";

function determineBackground(vhuData) {
  if (!vhuData) return "bg-dark";
  if (vhuData.JenisBerhenti_ID !== null) return "bg-danger";
  if (vhuData.StatusKerja?.includes("PKWTT")) return "bg-topbar";

  const berlaku = moment(vhuData.Berlaku_sdgn);
  const now = moment();
  const diffMonths = berlaku.diff(now, "months", true);

  if (berlaku >= now) return "bg-success";
  if (diffMonths < 1) return "bg-warning";
  return "bg-danger";
}

export const findLokerByKategori = async (req, res) => {
  try {
    const { NAME } = req.body;
    if (!NAME) {
      return res.status(400).json({ msg: "Invalid Request" });
    }

    const blocks = await FindLokeBlockByRoom({ body: { ret: "ret", ROOM: NAME } });
    if (blocks === "err") {
      return res.status(500).json({ msg: "Error finding locker block by room" });
    }

    const result = await Promise.all(
      blocks.map(async (block) => {
        const rbindex = Array.from({ length: block.ROW }, (_, i) => i + 1);
        const rcIndex = Array.from({ length: block.COL }, (_, i) => i + 1);

        const loc = await Promise.all(
          rbindex.map(async (rb) => {
            const cols = await Promise.all(
              rcIndex.map(async (rc) => {
                const locker = await MMasterLoker.findOne({
                  raw: true,
                  nest: true,
                  where: {
                    BLOCKID: block.BLOCKID,
                    PATH: rc,
                    STAND: rb,
                  },
                });

                let vhuData = null;
                if (locker?.NIK && locker?.STATUS_KARYAWAN !== "MAGANG") {
                  vhuData = await MVHU.findOne({
                    raw: true,
                    nest: true,
                    where: { NoPegawai: locker.NIK },
                  });
                }

                const statusLoker = locker?.NIK ? "Use" : "Not Use";
                let bg;
                if (locker?.STATUS_KARYAWAN === "MAGANG") {
                  bg = "bg-purple";
                } else {
                  bg = determineBackground(vhuData);
                }

                return {
                  COL: rc,
                  LOCKERID: locker?.LOCKERID || null,
                  ZONE: block.ZONE,
                  BLOCKID: block.BLOCKID.toString(),
                  BLOCK: block.BLOCK,
                  STAND: rb,
                  PATH: rc,
                  NAME: locker?.NAME || null,
                  NIK: vhuData?.NoPegawai || locker?.NIK || null,
                  NAMA: vhuData?.Nama || locker?.NAMA || null,
                  DEPT: vhuData?.DEPT || locker?.DEPT || null,
                  STATUS_KARYAWAN: vhuData?.StatusKerja || locker?.STATUS_KARYAWAN || null,
                  STATUS_LOKER: statusLoker,
                  BG: bg,
                };
              })
            );
            cols.sort((a, b) => b.COL - a.COL);
            return { ROW: rb, COL: cols };
          })
        );
        loc.sort((a, b) => b.ROW - a.ROW);
        return {
          BLOCKID: block.BLOCKID,
          BLOCK: block.BLOCK,
          ROOM: block.ROOM,
          ZONE: block.ZONE,
          STATUS: block.STATUS,
          ROW: block.ROW,
          COL: block.COL,
          LOC: loc,
        };
      })
    );
    return res.status(200).json(result);
  } catch (err) {
    
    return res.status(500).json({ msg: err.message });
  }
};