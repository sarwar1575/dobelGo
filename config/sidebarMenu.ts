import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  UserCircle,
  UserCog,
} from "lucide-react";

export type SidebarMenuItem = {
  name: string;
  href: string;
  icon: LucideIcon;
};

export const sidebarMenuItems: SidebarMenuItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "User", href: "/user", icon: Users },
  { name: "User2", href: "/user2", icon: UserCircle },
  { name: "Category", href: "/category", icon: UserCog },
];

