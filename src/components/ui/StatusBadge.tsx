export default function StatusBadge({
  status,
  borrowedBy,
  showAvailable = false,
}: {
  status: "available" | "borrowed";
  borrowedBy?: string;
  showAvailable?: boolean;
}) {
  if (status === "available") {
    if (!showAvailable) return null;
    return (
      <span className="btn btn-outline btn-success btn-sm pointer-events-none">
        Available
      </span>
    );
  }
  return <span className="badge badge-warning px-1.5 py-1">{borrowedBy}</span>;
}
