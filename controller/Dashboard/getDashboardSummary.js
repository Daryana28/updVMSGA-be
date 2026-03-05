// getDashboardSummary.js - Fixed for roomrequest structure
import db from '../../model/index.js';
const { MMasterRoom, MRequestRoom, MReqVisitor, MMasterCar } = db;
import { Op } from 'sequelize';

export const getDashboardSummary = async (req, res) => {
  try {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

    const [
      totalRooms,
      occupiedRooms,
      activeVisitors,
      carStats,
      recentVisitors
    ] = await Promise.all([
      MMasterRoom.count(),
      MRequestRoom.count({ 
        where: { 
          tanggal: dateStr,
          status: { [Op.ne]: 'Cancelled' }
        } 
      }),
      MReqVisitor.count({ 
        where: { 
          status: 'Checked-in',
          startDate: dateStr
        } 
      }),
      db.sequelize.query(`
        SELECT 
          COUNT(CARID) as total,
          SUM(CASE WHEN STATUS = 'Ready' THEN 1 ELSE 0 END) as ready
        FROM CARMASTER
      `, {
        type: db.sequelize.QueryTypes.SELECT,
        plain: true
      }),
      MReqVisitor.findAll({
        where: { 
          startDate: dateStr,
          status: { [Op.ne]: 'Cancelled' }
        },
        attributes: [['TAMU', 'name'], ['PIC', 'host_name'], ['STATUS', 'status']],
        order: [['VISITTIME', 'ASC']],
        limit: 5,
        raw: true
      })
    ]);

    // Query untuk recent meetings dengan join manual karena tidak ada STARTTIME
    const recentMeetings = await db.sequelize.query(`
      SELECT TOP 5 
        r.REQUEST_TOKEN,
        r.SUBJECT,
        r.STATUS,
        rm.NAMA as room_name
      FROM roomrequest r
      LEFT JOIN ROOMMASTER rm ON r.ROOMID = rm.ROOMID
      WHERE r.TANGGAL = :dateStr 
        AND r.STATUS != 'Cancelled'
      ORDER BY r.REQUEST_TOKEN ASC
    `, {
      replacements: { dateStr },
      type: db.sequelize.QueryTypes.SELECT,
      raw: true
    });

    const fleet = carStats || { total: 0, ready: 0 };

    res.json({
      success: true,
      stats: {
        meeting: `${totalRooms - occupiedRooms}/${totalRooms}`,
        visitor: activeVisitors.toString(),
        fleet: `${fleet.ready || 0}/${fleet.total || 0}`,
        parking: "85%"
      },
      recentMeetings: recentMeetings.map(m => ({
        room: m.room_name || 'Unknown',
        subject: m.SUBJECT || 'No Subject',
        time: 'N/A',
        status: m.STATUS || 'Scheduled'
      })),
      recentVisitors: recentVisitors.map(v => ({
        name: v.name || '',
        host: v.host_name || '',
        status: v.status || ''
      }))
    });

  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ 
      success: false, 
      msg: 'Internal server error'
    });
  }
};