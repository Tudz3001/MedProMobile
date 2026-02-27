/**
 * NotificationService.js
 * ──────────────────────────────────────────────────────────────────────
 * Quản lý toàn bộ thông báo nhắc uống thuốc.
 * Dùng @notifee/react-native — hỗ trợ Android 8+ đáng tin cậy.
 *
 * Notifee dùng AlarmManager chính xác (exact alarm) nên:
 *  - Hoạt động ngay cả khi điện thoại ở chế độ Doze / Battery Saver
 *  - KHÔNG bị Android kill như background job thông thường
 */

import notifee, {
  TriggerType,
  AndroidImportance,
  AndroidCategory,
  AuthorizationStatus,
} from '@notifee/react-native';
import { SCHEDULE_MAP } from '../data/medicineDb';

const CHANNEL_ID = 'medpro_reminders';
const CHANNEL_NAME = 'Nhắc uống thuốc';

// ── Khởi tạo channel Android (chỉ cần gọi 1 lần) ─────────────────────
export async function setupNotificationChannel() {
  await notifee.createChannel({
    id: CHANNEL_ID,
    name: CHANNEL_NAME,
    importance: AndroidImportance.HIGH,      // Hiện banner + âm thanh
    sound: 'default',
    vibration: true,
    vibrationPattern: [300, 500, 300, 500],
    lights: true,
    lightColor: '#4f7cff',
  });
}

// ── Xin quyền thông báo (Android 13+) ────────────────────────────────
export async function requestPermissions() {
  const settings = await notifee.requestPermission();
  return settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED;
}

// ── Xin quyền đặt báo thức chính xác (Android 12+) ──────────────────
export async function requestExactAlarmPermission() {
  try {
    // Trên Android 12+ cần SET_EXACT_ALARM permission
    await notifee.openBatteryOptimizationSettings();
  } catch {}
}

// ── Hủy tất cả thông báo cũ của 1 thuốc ─────────────────────────────
export async function cancelMedicineNotifications(medicineName) {
  const pending = await notifee.getTriggerNotifications();
  for (const notif of pending) {
    if (notif.notification.data?.medicineName === medicineName) {
      await notifee.cancelTriggerNotification(notif.notification.id);
    }
  }
}

// ── Hủy toàn bộ thông báo ────────────────────────────────────────────
export async function cancelAllNotifications() {
  await notifee.cancelAllNotifications();
}

// ── Lên lịch thông báo cho 1 thuốc ───────────────────────────────────
export async function scheduleMedicineNotifications(medicine) {
  // Xóa thông báo cũ trước
  await cancelMedicineNotifications(medicine.name);

  const times = medicine.custom_times ||
    SCHEDULE_MAP[medicine.frequency] ||
    SCHEDULE_MAP[2];

  const now = new Date();
  const scheduled = [];

  for (const timeStr of times) {
    const [hour, minute] = timeStr.split(':').map(Number);

    // Lên lịch cho 30 ngày tới
    for (let dayOffset = 0; dayOffset <= 30; dayOffset++) {
      const triggerDate = new Date(now);
      triggerDate.setDate(now.getDate() + dayOffset);
      triggerDate.setHours(hour, minute, 0, 0);

      // Bỏ qua thời gian đã qua hôm nay
      if (triggerDate <= now) continue;

      const notifId = `med_${medicine.name}_${timeStr}_${dayOffset}`
        .replace(/[^a-zA-Z0-9_]/g, '_');

      const detail = [medicine.dose, medicine.instruction]
        .filter(Boolean).join(' · ');

      await notifee.createTriggerNotification(
        {
          id: notifId,
          title: `💊 Đến giờ uống thuốc!`,
          body: `${timeStr} — ${medicine.name}${detail ? '\n' + detail : ''}`,
          android: {
            channelId: CHANNEL_ID,
            importance: AndroidImportance.HIGH,
            category: AndroidCategory.REMINDER,
            sound: 'default',
            smallIcon: 'ic_notification',   // drawable/ic_notification.png
            color: '#4f7cff',
            pressAction: { id: 'default' },
            // Hiện thông báo ngay cả khi màn hình tắt
            fullScreenAction: { id: 'default' },
            actions: [
              { title: '✅ Đã uống', pressAction: { id: 'taken' } },
              { title: '⏰ Nhắc lại 10 phút', pressAction: { id: 'snooze' } },
            ],
          },
          data: {
            medicineName: medicine.name,
            time: timeStr,
            date: triggerDate.toISOString().split('T')[0],
          },
        },
        {
          type: TriggerType.TIMESTAMP,
          timestamp: triggerDate.getTime(),
          // alarmManager: true → dùng AlarmManager chính xác
          alarmManager: { allowWhileIdle: true },
        }
      );
      scheduled.push(notifId);
    }
  }
  return scheduled;
}

// ── Lên lịch lại toàn bộ thuốc ───────────────────────────────────────
export async function rescheduleAll(medicines) {
  await cancelAllNotifications();
  for (const med of medicines) {
    await scheduleMedicineNotifications(med);
  }
}

// ── Xử lý khi user nhấn action trên thông báo ────────────────────────
// Gọi hàm này trong App.js: notifee.onForegroundEvent / onBackgroundEvent
export function handleNotificationAction(detail, onTaken, onSnooze) {
  const { pressAction, notification } = detail;
  const data = notification?.data || {};

  if (pressAction?.id === 'taken') {
    const key = `${data.medicineName}@${data.time}@${data.date}`;
    onTaken && onTaken(key);
  }

  if (pressAction?.id === 'snooze') {
    // Nhắc lại sau 10 phút
    const snoozeTime = Date.now() + 10 * 60 * 1000;
    notifee.createTriggerNotification(
      {
        title: `⏰ Nhắc lại: ${data.medicineName}`,
        body: notification.body,
        android: { channelId: CHANNEL_ID, importance: AndroidImportance.HIGH, sound: 'default' },
        data,
      },
      { type: TriggerType.TIMESTAMP, timestamp: snoozeTime, alarmManager: { allowWhileIdle: true } }
    );
  }
}
