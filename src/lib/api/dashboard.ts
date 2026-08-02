import { createClient } from "@/lib/supabase/client";
import { Book } from "@/lib/types";

// ---- DASHBOARD STATS ----
export interface DashboardStats {
  totalBooks: number;
  issuedBooks: number;
  availableBooks: number;
  pendingRequests: number;
  totalReaders: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createClient();

  // head: true → sirf count aata hai, rows nahi (fast + kam bandwidth)
  const [totalBooksRes, issuedRes, pendingRes, readersRes] = await Promise.all([
    supabase.from("books").select("*", { count: "exact", head: true }),
    supabase
      .from("books")
      .select("*", { count: "exact", head: true })
      .eq("status", "borrowed"),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "reader")
      .eq("status", "pending"),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "reader")
      .eq("status", "approved"),
  ]);

  const totalBooks = totalBooksRes.count ?? 0;
  const issuedBooks = issuedRes.count ?? 0;

  return {
    totalBooks,
    issuedBooks,
    availableBooks: totalBooks - issuedBooks,
    pendingRequests: pendingRes.count ?? 0,
    totalReaders: readersRes.count ?? 0,
  };
}

// ---- RECENTLY BORROWED (dashboard ke liye) ----
export async function getRecentlyBorrowed(limit = 5): Promise<Book[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("books")
    .select("*, borrow_records(borrower_id, borrowed_at)")
    .eq("status", "borrowed")
    .order("borrowed_at", { ascending: false, foreignTable: "borrow_records" })
    .limit(limit);

  if (error) {
    console.error("getRecentlyBorrowed error:", error.message);
    return [];
  }

  return (data as any[]).map((row) => ({
    id: row.id,
    titlePage: row.title_page ?? "",
    bookName: row.book_name,
    authorName: row.author_name,
    subject: row.subject,
    maktaba: row.maktaba,
    libraryCode: row.library_code,
    bookLink: row.book_link ?? "",
    status: row.status,
    borrowedBy: row.borrowed_by ?? undefined,
    borrowedAt: row.borrow_records?.[0]?.borrowed_at ?? undefined,
    addedAt: row.created_at,
  }));
}
