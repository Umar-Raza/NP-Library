import { createClient } from "@/lib/supabase/client";

// Meri saari favorite book ids (Set — tez lookup)
export async function getMyFavoriteIds(): Promise<Set<string>> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Set();

  const { data, error } = await supabase
    .from("favorites")
    .select("book_id")
    .eq("reader_id", user.id);

  if (error) {
    console.error("getMyFavoriteIds error:", error.message);
    return new Set();
  }
  return new Set((data ?? []).map((f) => f.book_id));
}

// Toggle — star/unstar
export async function toggleFavorite(
  bookId: string,
  isCurrentlyFav: boolean,
): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Login nahi hai.");

  if (isCurrentlyFav) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("reader_id", user.id)
      .eq("book_id", bookId);
    if (error) throw new Error("Remove nahi ho saka.");
  } else {
    const { error } = await supabase
      .from("favorites")
      .insert({ reader_id: user.id, book_id: bookId });
    if (error) {
      if (error.message.includes("FAVORITE_LIMIT_REACHED")) {
        throw new Error("Aap zyada se zyada 25 books favorite kar sakte hain.");
      }
      throw new Error("Add nahi ho saka.");
    }
  }
}

// Sirf favorite books (Starred page ke liye)
export async function getMyFavoriteBooks() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("favorites")
    .select("book_id, books(*, borrow_records(borrower_id, borrowed_at))")
    .eq("reader_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getMyFavoriteBooks error:", error.message);
    return [];
  }

  return (data ?? [])
    .map((f: any) => f.books)
    .filter(Boolean)
    .map((row: any) => ({
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
      addedAt: row.created_at,
      isFavorite: true,
    }));
}
