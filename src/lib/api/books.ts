import { createClient } from "@/lib/supabase/client";
import { Book } from "@/lib/types";

// DB row shape (snake_case) — jaisa Supabase se aata hai
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

// Add/Edit ke liye input shape (camelCase — form se aata hai)
export interface BookInput {
  titlePage: string;
  bookName: string;
  authorName: string;
  subject: string;
  maktaba: string;
  libraryCode: string;
  bookLink: string;
}

// DB row → frontend Book
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

// frontend input → DB columns
function mapInputToRow(input: BookInput) {
  return {
    title_page: input.titlePage || null,
    book_name: input.bookName,
    author_name: input.authorName,
    subject: input.subject,
    maktaba: input.maktaba,
    library_code: input.libraryCode,
    book_link: input.bookLink || null,
  };
}

// ============================================
// FETCH — pagination + server-side search/filter/sort
// ============================================
const PAGE_SIZE = 6;

export interface GetBooksParams {
  page: number; // 0-based
  search?: string;
  subject?: string;
  sort?: "newest" | "oldest" | "title-az" | "title-za";
}

export interface GetBooksResult {
  books: Book[];
  hasMore: boolean;
}

export async function getBooks(
  params: GetBooksParams,
): Promise<GetBooksResult> {
  const supabase = createClient();
  const { page, search = "", subject = "", sort = "newest" } = params;

  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase.from("books").select("*", { count: "exact" });

  // Search — book name / author / library code (case-insensitive)
  if (search.trim()) {
    const s = search.trim();
    query = query.or(
      `book_name.ilike.%${s}%,author_name.ilike.%${s}%,library_code.ilike.%${s}%`,
    );
  }

  // Subject filter
  if (subject) {
    query = query.eq("subject", subject);
  }

  // Sort
  switch (sort) {
    case "oldest":
      query = query.order("created_at", { ascending: true });
      break;
    case "title-az":
      query = query.order("book_name", { ascending: true });
      break;
    case "title-za":
      query = query.order("book_name", { ascending: false });
      break;
    default: // newest
      query = query.order("created_at", { ascending: false });
  }

  // Sirf is page ke 6 rows
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("getBooks error:", error.message);
    throw new Error("Books load nahi ho saki.");
  }

  const books = (data as BookRow[]).map(mapRowToBook);
  const hasMore = count !== null ? to + 1 < count : books.length === PAGE_SIZE;

  return { books, hasMore };
}

// ---- ADD ----
export async function addBook(input: BookInput): Promise<Book> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("books")
    .insert(mapInputToRow(input))
    .select()
    .single();

  if (error) {
    console.error("addBook error:", error.message);
    throw new Error("Book add nahi ho saki.");
  }
  return mapRowToBook(data as BookRow);
}

// ---- UPDATE ----
export async function updateBook(id: string, input: BookInput): Promise<Book> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("books")
    .update(mapInputToRow(input))
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("updateBook error:", error.message);
    throw new Error("Book update nahi ho saki.");
  }
  return mapRowToBook(data as BookRow);
}

// ---- DELETE ----
export async function deleteBook(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("books").delete().eq("id", id);

  if (error) {
    console.error("deleteBook error:", error.message);
    throw new Error("Book delete nahi ho saki.");
  }
}
