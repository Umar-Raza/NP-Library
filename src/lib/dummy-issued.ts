import { Book } from "./types";
import { dummyBooks } from "./dummy-books";

export const dummyIssuedBooks: Book[] = dummyBooks.filter(
  (b) => b.status === "borrowed",
);
