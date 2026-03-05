// PATH: backend/src/controllers/permit/updatePermit.js

export const updatePermit = async (req, res) => {
  try {
    const { id } = req.params;
    const permitData = req.body;
    
    const permit = await req.db.Permit.findOne({ where: { id: parseInt(id) } });
    if (!permit) {
      return res.status(404).json({ success: false, msg: 'Permit tidak ditemukan' });
    }

    if (permitData.bulan === '' || permitData.perusahaan === '' || permitData.lokasi === '') {
      return res.status(400).json({ 
        success: false, 
        msg: 'Data required: bulan, perusahaan, lokasi' 
      });
    }

    await permit.update(permitData);
    req.io.emit('permit_update', { action: 'updated', permit });

    res.json({
      success: true,
      msg: 'Permit berhasil diperbarui',
      permit
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      msg: 'Gagal memperbarui permit',
      error: error.message 
    });
  }
};