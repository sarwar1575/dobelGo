"use client";

import { useState } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { Navbar } from "@/layout/Navbar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex">
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />

      {/* Content area shifts on desktop to make space for fixed sidebar */}
      <div className="flex-1 flex flex-col md:ml-64">
        <Navbar onToggleSidebar={handleToggleSidebar} />
        <main className="flex-1 bg-[#FBFBFB] min-h-screen">{children}</main>
      </div>

      {/* Mobile overlay behind sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={handleCloseSidebar}
        />
      )}
    </div>
  );
}

