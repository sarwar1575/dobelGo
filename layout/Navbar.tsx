"use client";

import React from "react";
import { Menu, User } from "lucide-react";

interface NavbarProps {
  /** Toggle callback for mobile sidebar */
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  return (
    <header className="h-16 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-40 w-full px-4 md:px-8">
      <div className="flex h-full items-center justify-between gap-4">
        {/* Left: Menu button on mobile */}
        <button
          type="button"
          aria-label="Open sidebar"
          onClick={onToggleSidebar}
          className="md:hidden inline-flex items-center justify-center rounded-full p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <Menu size={20} />
        </button>

        {/* Right: User Profile */}
        <div className="flex flex-1 items-center justify-end">
          <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors group">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900 leading-none">
                Gufraan Ahmad
              </p>
              <p className="text-[10px] font-medium text-gray-400 mt-1 uppercase tracking-wider">
                Super Admin
              </p>
            </div>

            {/* User Avatar Placeholder */}
            <div className="w-9 h-9 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm group-hover:shadow-md transition-all">
              <User size={20} className="text-black" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};