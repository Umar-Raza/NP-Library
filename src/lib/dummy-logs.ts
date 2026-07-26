import { BookLog } from "./types";

export const dummyLogs: BookLog[] = [
  {
    id: "1",
    bookName: "Tafseer Ibn Kaseer",
    readerName: "Ahmed Raza",
    action: "borrowed",
    timestamp: "2026-07-18T14:30:00",
  },
  {
    id: "2",
    bookName: "Sahih Bukhari Jild 1",
    readerName: "Bilal Hussain",
    action: "borrowed",
    timestamp: "2026-07-10T09:15:00",
  },
  {
    id: "3",
    bookName: "Sahih Bukhari Jild 1",
    readerName: "Bilal Hussain",
    action: "returned",
    timestamp: "2026-07-17T11:00:00",
  },
  {
    id: "4",
    bookName: "Fiqh ul Islam",
    readerName: "Ahmed Raza",
    action: "borrowed",
    timestamp: "2026-06-25T16:45:00",
  },
  {
    id: "5",
    bookName: "Fiqh ul Islam",
    readerName: "Ahmed Raza",
    action: "returned",
    timestamp: "2026-07-05T10:20:00",
  },
];
