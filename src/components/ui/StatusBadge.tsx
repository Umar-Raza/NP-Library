export default function StatusBadge({
  status,
  borrowedBy,
}: {
  status: "available" | "borrowed";
  borrowedBy?: string;
}) {
  if (status === "available") {
    return null; // Borrow button already indicates availability
  }
  return <span className="badge badge-warning">{borrowedBy}</span>;
}
