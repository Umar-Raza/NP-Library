import { createClient } from "@/lib/supabase/client";
import { Book } from "@/lib/types";

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
  // latest borrow record (join) — current holder ki id
  borrow_records?: { borrower_id: string | null; borrowed_at: string }[];
}

export interface BookInput {
  titlePage: string;
  bookName: string;
  authorName: string;
  subject: string;
  maktaba: string;
  libraryCode: string;
  bookLink: string;
}

function mapRowToBook(row: BookRow): Book {
  // Latest borrow record = current holder (borrowed_at desc order se pehla)
  const latest = row.borrow_records?.[0];
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
    borrowedById: latest?.borrower_id ?? undefined,
    addedAt: row.created_at,
  };
}

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
// FETCH — pagination + search/filter/sort + current holder id
// ============================================
const PAGE_SIZE = 6;

export interface GetBooksParams {
  page: number;
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

  // borrow_records join — latest borrower ki id ke liye
  let query = supabase
    .from("books")
    .select("*, borrow_records(borrower_id, borrowed_at)", { count: "exact" });

  if (search.trim()) {
    const s = search.trim();
    query = query.or(
      `book_name.ilike.%${s}%,author_name.ilike.%${s}%,library_code.ilike.%${s}%`,
    );
  }

  if (subject) {
    query = query.eq("subject", subject);
  }

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
    default:
      query = query.order("created_at", { ascending: false });
  }

  // Latest borrow record pehle aaye (current holder)
  query = query.order("borrowed_at", {
    ascending: false,
    foreignTable: "borrow_records",
  });

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
    .select("*, borrow_records(borrower_id, borrowed_at)")
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
    .select("*, borrow_records(borrower_id, borrowed_at)")
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

// ---- BORROW / TRANSFER ----
export async function borrowBook(
  bookId: string,
  borrowerName: string,
  borrowerId?: string,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.rpc("borrow_book", {
    p_book_id: bookId,
    p_borrower_name: borrowerName,
    p_borrower_id: borrowerId ?? null,
  });
  if (error) {
    console.error("borrowBook error:", error.message);
    throw new Error("Borrow nahi ho saka.");
  }
}

// ---- RETURN (librarian only) ----
export async function returnBook(bookId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.rpc("return_book", { p_book_id: bookId });
  if (error) {
    console.error("returnBook error:", error.message);
    throw new Error(error.message);
  }
}

// ---- ISSUED BOOKS (saari borrowed books with pagination) ----
export interface GetIssuedBooksParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface GetIssuedBooksResult {
  books: Book[];
  hasMore: boolean;
}

export async function getIssuedBooks(
  params: GetIssuedBooksParams = {},
): Promise<GetIssuedBooksResult> {
  const supabase = createClient();
  const { page = 0, pageSize = 10, search = "" } = params;

  const from = page * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("books")
    .select("*, borrow_records(borrower_id, borrowed_at)", { count: "exact" })
    .eq("status", "borrowed")
    .order("borrowed_at", { ascending: false, foreignTable: "borrow_records" });

  if (search.trim()) {
    const s = search.trim();
    query = query.or(`book_name.ilike.%${s}%,borrowed_by.ilike.%${s}%`);
  }

  query = query.order("book_name", { ascending: true }).range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("getIssuedBooks error:", error.message);
    throw new Error("Issued books load nahi ho saki.");
  }

  const books = (data as any[]).map((row) => ({
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
    borrowedById: row.borrow_records?.[0]?.borrower_id ?? undefined,
    borrowedAt: row.borrow_records?.[0]?.borrowed_at ?? undefined,
    addedAt: row.created_at,
  }));

  const hasMore = count !== null ? to + 1 < count : books.length === pageSize;

  return { books, hasMore };
}

// ---- BOOKS LOG (borrow chain per book) ----
export interface ChainEntry {
  borrowerName: string;
  borrowedAt: string;
}

export interface BookChain {
  bookId: string;
  bookName: string;
  chain: ChainEntry[];
}

export async function getBooksLog(search = ""): Promise<BookChain[]> {
  const supabase = createClient();

  // Sirf borrowed books, unke saare borrow_records ke sath (chain)
  let query = supabase
    .from("books")
    .select("id, book_name, borrow_records(borrower_name, borrowed_at)")
    .eq("status", "borrowed")
    .order("borrowed_at", { ascending: true, foreignTable: "borrow_records" });

  if (search.trim()) {
    query = query.ilike("book_name", `%${search.trim()}%`);
  }

  const { data, error } = await query.order("book_name", { ascending: true });

  if (error) {
    console.error("getBooksLog error:", error.message);
    throw new Error("Books log load nahi ho saka.");
  }

  return (data as any[])
    .filter((row) => (row.borrow_records?.length ?? 0) > 0)
    .map((row) => ({
      bookId: row.id,
      bookName: row.book_name,
      chain: (row.borrow_records ?? []).map((r: any) => ({
        borrowerName: r.borrower_name,
        borrowedAt: r.borrowed_at,
      })),
    }));
}
