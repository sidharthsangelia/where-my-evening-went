"use client";

import { Archive, Brain, CircleUserRound, House, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/dashboard", icon: House },
    { name: "Insights", href: "/insight", icon: Brain },
    { name: "Archive", href: "/archive", icon: Archive },
    { name: "Profile", href: "/profile", icon: CircleUserRound },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className=" bg-white border-t shadow-lg">
        <ul className="flex items-center justify-around py-2">
          
          {/* Left side */}
          {navItems.slice(0, 2).map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex flex-col items-center text-xs transition-colors ${
                    isActive ? "text-black" : "text-gray-400"
                  }`}
                >
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}

          {/* Center Floating Button */}
          <li className="relative -top-6">
            <Link
              href="/record"
              className="bg-black text-white p-4 rounded-full shadow-lg flex items-center justify-center"
            >
              <Plus size={28} strokeWidth={2.5} />
            </Link>
          </li>

          {/* Right side */}
          {navItems.slice(2).map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex flex-col items-center text-xs transition-colors ${
                    isActive ? "text-black" : "text-gray-400"
                  }`}
                >
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
