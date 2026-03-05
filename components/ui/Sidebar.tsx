"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCircle,
  UserCog,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "User", href: "/user", icon: Users },
  { name: "User2", href: "/user2", icon: UserCircle },
  { name: "Settings", href: "/settings", icon: UserCog },
];

interface SidebarProps {
  /** Mobile open state; on desktop sidebar is always visible */
  isOpen?: boolean;
  /** Optional close handler for mobile */
  onClose?: () => void;
}

export const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 h-screen bg-white border-r border-gray-100 flex flex-col overflow-hidden transform transition-transform duration-200",
        // Mobile: slide in/out
        isOpen ? "translate-x-0" : "-translate-x-full",
        // Desktop: always visible (and fixed)
        "md:translate-x-0"
      )}
    >
      {/* Logo + Close (mobile) */}
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-2xl font-black text-yellow-500 tracking-tighter">
          DobelGo<span className="text-gray-900">.</span>
        </h1>
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="md:hidden inline-flex items-center justify-center rounded-full p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2 overflow-hidden pb-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group",
                isActive
                  ? "bg-yellow-500 text-black shadow-md shadow-yellow-200"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon
                size={20}
                className={cn(
                  isActive
                    ? "text-black"
                    : "text-gray-400 group-hover:text-gray-900"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button at Bottom */}
      <div className="p-4 border-t border-gray-50">
        <button
          onClick={() => console.log("Logging out...")}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-all group"
        >
          <LogOut
            size={20}
            className="group-hover:translate-x-1 transition-transform"
          />
          Logout
        </button>
      </div>
    </aside>
  );
};