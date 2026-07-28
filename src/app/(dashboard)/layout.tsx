import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { SidebarProvider } from "@/context/SidebarContext";
import { MessagesProvider } from "@/context/MessagesContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <MessagesProvider>
        <div className="flex h-screen bg-slate-50 overflow-hidden">
          {/* Sidebar — desktop fixed | mobile drawer */}
          <Sidebar />

          {/* Main content area */}
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            {/* Top navbar */}
            <Navbar />

            {/* Page content */}
            <main className="flex-1 overflow-y-auto p-4 lg:p-6">
              {children}
            </main>
          </div>
        </div>
      </MessagesProvider>
    </SidebarProvider>
  );
}
