export interface Reader {
  id: string;
  fullName: string;
  email: string;
  status: "pending" | "approved";
  registeredAt: string;
}

export const dummyReaders: Reader[] = [
  {
    id: "1",
    fullName: "Umar",
    email: "umar@example.com",
    status: "approved",
    registeredAt: "2026-06-15",
  },
  {
    id: "2",
    fullName: "Ahmed Raza",
    email: "ahmed@example.com",
    status: "approved",
    registeredAt: "2026-06-20",
  },
  {
    id: "3",
    fullName: "Bilal Hussain",
    email: "bilal@example.com",
    status: "approved",
    registeredAt: "2026-07-01",
  },
  {
    id: "4",
    fullName: "Sara Khan",
    email: "sara@example.com",
    status: "pending",
    registeredAt: "2026-07-24",
  },
  {
    id: "5",
    fullName: "Zainab Ali",
    email: "zainab@example.com",
    status: "pending",
    registeredAt: "2026-07-25",
  },
  {
    id: "6",
    fullName: "Hamza Tariq",
    email: "hamza@example.com",
    status: "pending",
    registeredAt: "2026-07-26",
  },
];
