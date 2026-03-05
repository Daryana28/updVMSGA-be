/* controllers/notifications/subscribe.js */
import PushSubscription from '../../model/PushSubscription.js';

const subscribe = async (req, res) => {
  try {
    const subscription = req.body;
    const nik = req.user?.nik;
    const token = req.cookies?.token; 

    // 1. Validasi Input
    if (!subscription?.endpoint || !nik) {
      return res.status(400).json({ 
        status: 'ERROR', 
        message: 'SUBSCRIPTION_DATA_MISSING' 
      });
    }

    // 2. Operasi UPSERT
    // Sequelize akan mencari 'endpoint' yang sama. Jika ketemu, UPDATE. Jika tidak, INSERT.
    await PushSubscription.upsert({
      endpoint: subscription.endpoint,
      nik: String(nik),
      token: token || null,
      p256dh: subscription.keys?.p256dh || null,
      auth: subscription.keys?.auth || null,
      // updatedAt akan otomatis diisi oleh Sequelize karena timestamps: true
    });

    res.status(201).json({ 
      status: 'SUCCESS', 
      message: 'PUSH_SUBSCRIPTION_REGISTERED' 
    });

  } catch (error) {
    console.error("WebPush Subscription Error:", error);
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'INTERNAL_SERVER_ERROR',
      details: error.message 
    });
  }
};

export default subscribe;