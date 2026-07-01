import { Notification } from '../types/models';

export const notifications: Notification[] = [
  {
    "id": "notif_1",
    "userId": "usr_1",
    "title": "تم نشر درس جديد",
    "message": "تمت إضافة المحاضرة الرابعة في كورس الفيزياء.",
    "type": "INFO",
    "isRead": false,
    "createdAt": "2026-07-01T09:53:59.936Z"
  },
  {
    "id": "notif_2",
    "userId": "usr_1",
    "title": "اكتملت عملية الدفع",
    "message": "تم تجديد اشتراكك في الباقة المميزة بنجاح.",
    "type": "SUCCESS",
    "isRead": true,
    "createdAt": "2026-06-30T09:53:59.936Z"
  }
];