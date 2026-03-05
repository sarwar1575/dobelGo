"use client";

import React from "react";
import { LogOut, Menu, Settings, ShieldCheck, User } from "lucide-react";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";

interface NavbarProps {
  /** Toggle callback for mobile sidebar */
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const dropdownItems = [
    {
      label: "My Profile",
      icon: <User size={16} />,
      href: "/dashboard/profile",
    },
    {
      label: "Settings",
      icon: <Settings size={16} />,
      href: "/dashboard/settings",
    },
    {
      label: "Security",
      icon: <ShieldCheck size={16} />,
      href: "/dashboard/security",
    },
    {
      label: "Logout",
      icon: <LogOut size={16} />,
      onClick: () => console.log("Logout"),
      variant: "danger" as const,
    },
  ];
  return (
    <header className="h-16 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-40 w-full px-4 md:px-8">
      <div className="flex h-full items-center justify-end">
        <Dropdown
          items={dropdownItems}
          trigger={
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900 leading-none">
                  Gufraan Ahmad
                </p>
                <p className="text-[10px] font-medium text-gray-400 mt-1 uppercase tracking-wider">
                  Super Admin
                </p>
              </div>
              <div className="w-9 h-9 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                <User size={18} className="text-black" />
              </div>
            </div>
          }
        />
      </div>
    </header>
  );
};
