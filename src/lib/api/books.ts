import { createClient } from "@/lib/supabase/client";
import { Book } from "@/lib/types";

// DB row (snake_case) — jaisa Supabase se aata hai
interface BookRow {
  id: string;
  title_page: string | null;
  book_name: string;
  author_name: string;
  subject: string;
  maktaba: string;
  library_code: string;
  book_link: string | null;
  status: "available" | "borrowed";
  borrowed_by: string | null;
  created_at: string;
}

// DB row → frontend Book (camelCase)
function mapRowToBook(row: BookRow): Book {
  return {
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
    addedAt: row.created_at,
  };
}

// Saari books fetch karein (newest first)
export async function getBooks(): Promise<Book[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("books")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getBooks error:", error.message);
    throw new Error("Books load nahi ho saki.");
  }

  return (data as BookRow[]).map(mapRowToBook);
}
