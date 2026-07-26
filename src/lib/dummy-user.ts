export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: "reader" | "librarian";
  status: "pending" | "approved";
  joinedAt: string;
}

export const dummyUser: UserProfile = {
  id: "1",
  fullName: "Umar Reader",
  email: "umar@example.com",
  role: "reader",
  status: "approved",
  joinedAt: "2026-06-15",
};
