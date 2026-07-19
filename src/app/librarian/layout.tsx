import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

export default function LibrarianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-base-200">
      <Sidebar role="librarian" />
      <div className="ml-64 flex flex-col min-h-screen">
        <Topbar userName="Librarian" role="librarian" />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
