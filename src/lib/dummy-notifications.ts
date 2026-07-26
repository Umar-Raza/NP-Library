export interface Notification {
  id: string;
  message: string;
  type: "approved" | "rejected" | "borrowed" | "request" | "info";
  isRead: boolean;
  createdAt: string;
}

export const dummyNotifications: Notification[] = [
  {
    id: "1",
    message: "Aapki registration request approve ho gayi hai.",
    type: "approved",
    isRead: false,
    createdAt: "2026-07-20T10:00:00",
  },
  {
    id: "2",
    message: "Aapne 'Sahih Bukhari Jild 1' successfully borrow ki hai.",
    type: "borrowed",
    isRead: false,
    createdAt: "2026-07-18T14:30:00",
  },
  {
    id: "3",
    message: "Naya book 'Fiqh ul Islam' library mein add hui hai.",
    type: "info",
    isRead: true,
    createdAt: "2026-07-15T09:00:00",
  },
];
