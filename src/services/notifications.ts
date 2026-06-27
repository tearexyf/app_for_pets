import { Capacitor } from "@capacitor/core";
import {
  LocalNotifications,
  type LocalNotificationSchema,
} from "@capacitor/local-notifications";
import type { Task } from "../types/Task";
import { getTasks, getPets, getSettings } from "./storage";

const NOTIFICATION_CHANNEL_ID = "task-reminders";

function taskNotificationId(taskId: number): number {
  return (Math.abs(taskId) % 2147483646) + 1;
}

function taskScheduledAt(task: Task): Date | null {
  if (!task.date || !task.time) return null;
  const at = new Date(`${task.date}T${task.time}`);
  if (Number.isNaN(at.getTime())) return null;
  return at;
}

function notificationTitle(language: "en" | "ru"): string {
  return language === "ru" ? "Напоминание о задаче" : "Task reminder";
}

function notificationBody(
  task: Task,
  petName: string,
  language: "en" | "ru"
): string {
  const time = task.time;
  if (petName) {
    return language === "ru"
      ? `${petName}: ${task.title} (${time})`
      : `${petName}: ${task.title} (${time})`;
  }
  return language === "ru"
    ? `${task.title} (${time})`
    : `${task.title} (${time})`;
}

async function ensureAndroidChannel(): Promise<void> {
  if (Capacitor.getPlatform() !== "android") return;

  try {
    await LocalNotifications.createChannel({
      id: NOTIFICATION_CHANNEL_ID,
      name: "Task reminders",
      description: "Reminders for pet care tasks",
      importance: 5,
      visibility: 1,
      sound: undefined,
      vibration: true,
    });
  } catch {
    // Channel may already exist
  }
}

export async function ensureNotificationPermission(): Promise<boolean> {
  if (Capacitor.isNativePlatform()) {
    const { display } = await LocalNotifications.checkPermissions();
    if (display !== "granted") {
      const result = await LocalNotifications.requestPermissions();
      if (result.display !== "granted") return false;
    }

    if (Capacitor.getPlatform() === "android") {
      try {
        const { exact_alarm } =
          await LocalNotifications.checkExactNotificationSetting();
        if (exact_alarm !== "granted") {
          await LocalNotifications.changeExactNotificationSetting();
        }
      } catch {
        // Exact alarm settings unavailable on older Android versions
      }
    }

    return true;
  }

  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export async function cancelAllTaskNotifications(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length === 0) return;
    await LocalNotifications.cancel({
      notifications: pending.notifications.map((n) => ({ id: n.id })),
    });
  } catch {
    // Ignore when notifications are unavailable
  }
}

export async function syncTaskNotifications(): Promise<void> {
  const settings = getSettings();

  if (!settings.taskReminders) {
    await cancelAllTaskNotifications();
    return;
  }

  if (!Capacitor.isNativePlatform()) return;

  const granted = await ensureNotificationPermission();
  if (!granted) return;

  await ensureAndroidChannel();
  await cancelAllTaskNotifications();

  const tasks = getTasks();
  const pets = getPets();
  const petNames = new Map(pets.map((p) => [p.id, p.name]));
  const now = new Date();
  const language = settings.language;

  const notifications: LocalNotificationSchema[] = [];

  for (const task of tasks) {
    if (task.completed) continue;

    const at = taskScheduledAt(task);
    if (!at || at <= now) continue;

    const petName = petNames.get(task.petId) ?? "";

    notifications.push({
      id: taskNotificationId(task.id),
      title: notificationTitle(language),
      body: notificationBody(task, petName, language),
      schedule: {
        at,
        allowWhileIdle: true,
      },
      channelId: NOTIFICATION_CHANNEL_ID,
      extra: { taskId: task.id },
    });
  }

  if (notifications.length === 0) return;

  await LocalNotifications.schedule({ notifications });
}

export function scheduleTaskNotificationsSync(): void {
  syncTaskNotifications().catch(() => {});
}
