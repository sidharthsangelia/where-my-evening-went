"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, House, Plus, Folder, User, LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  house:  House,
  brain:  Brain,
  plus:   Plus,
  folder: Folder,
  user:   User,
};

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

export default function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isAdd    = item.icon === "plus";
  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
  const Icon     = iconMap[item.icon];

  if (isAdd) {
    return (
      <Link
        href={item.href}
        className="w-12 h-12 mx-2 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <Plus size={26} strokeWidth={2.5} color="white" />
      </Link>
    );
  }

  return (
    <Link
      href={item.href}
      className="w-11 h-11 flex items-center justify-center rounded-full transition-colors"
      style={{
        color: isActive
          ? "white"
          : "var(--color-neutral-600)",
      }}
    >
      <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
    </Link>
  );
}