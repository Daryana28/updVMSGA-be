// PATH: be/controller/Notification/sendNotif.js
import webpush from 'web-push';
import PushSubscription from "../../model/PushSubscription.js";

// Mengaktifkan identitas server menggunakan kunci dari .env
webpush.setVapidDetails(
  'mailto:admin@ikoito.co.id', // Email kontak teknis
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export const sendPushNotif = async (targetNik, payload) => {
  try {
    // Cari semua endpoint yang terdaftar untuk NIK ini
    const subscriptions = await PushSubscription.findAll({
      where: { nik: String(targetNik) }
    });

    if (!subscriptions || subscriptions.length === 0) {
      
      return;
    }

    const notificationPayload = JSON.stringify({
      title: payload.title || "GA SYSTEM",
      body: payload.body || "Ada pembaruan status.",
      url: payload.url || "/"
    });

    const pushPromises = subscriptions.map(sub => {
      const pushConfig = {
        endpoint: sub.endpoint,
        keys: {
          auth: sub.auth,
          p256dh: sub.p256dh
        }
      };

      return webpush.sendNotification(pushConfig, notificationPayload)
        .catch(err => {
          // Jika status 410 (Gone), berarti user sudah unsubscribe/uninstalled
          if (err.statusCode === 410 || err.statusCode === 404) {
            return PushSubscription.destroy({ where: { id: sub.id } });
          }
          console.error(`[Push] Error NIK ${targetNik}:`, err.message);
        });
    });

    await Promise.all(pushPromises);
    

  } catch (error) {
    console.error("[Push] Critical Error:", error);
  }
};