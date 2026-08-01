import { MoreVertical, Pencil, Trash2 } from "lucide-react";

export default function AdminMenu({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="dropdown dropdown-end">
      <button
        tabIndex={0}
        className="btn btn-ghost btn-sm btn-square border border-base-300"
      >
        <MoreVertical size={16} />
      </button>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box shadow-lg border border-base-300 w-36 p-2 z-30"
      >
        <li>
          <a onClick={onEdit} className="flex items-center gap-2">
            <Pencil size={14} /> Edit
          </a>
        </li>
        <li>
          <a onClick={onDelete} className="flex items-center gap-2 text-error">
            <Trash2 size={14} /> Delete
          </a>
        </li>
      </ul>
    </div>
  );
}
