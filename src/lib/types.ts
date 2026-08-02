export type BookStatus = "available" | "borrowed";
export type ViewMode = "grid" | "list";
export type SortOption = "newest" | "oldest" | "title-az" | "title-za";

export interface Book {
  id: string;
  titlePage: string;
  bookName: string;
  authorName: string;
  subject: string;
  maktaba: string;
  libraryCode: string;
  bookLink: string;
  status: BookStatus;
  borrowedBy?: string;
  borrowedById?: string; // ← ye add karein
  addedAt: string; // ISO date, sorting ke liye
  borrowChain?: BorrowChainEntry[]; // hand-to-hand transfer history
  isFavorite?: boolean; // reader ke favorites ke liye
}

export interface BorrowChainEntry {
  readerName: string;
  timestamp: string;
}
