import "../styles/globals.css";
import Sidebar from "@/components/ui/Sidebar";
import Navbar from "@/components/ui/Navabar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-gray-900 text-white">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 min-h-screen bg-slate-50">
            <Navbar />
            <div>{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
