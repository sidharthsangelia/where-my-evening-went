// MobileNav.tsx (Server Component)
import NavLink from "./NavLink";

const navItems = [
  { name: "Home", href: "/dashboard", icon: "house" },
  { name: "Insights", href: "/insight", icon: "brain" },
  { name: "Add", href: "/record", icon: "plus" },
  { name: "Archive", href: "/archive", icon: "folder" },
  { name: "Profile", href: "/profile", icon: "user" },
] as const;

export default function MobileNav() {
  return (
    <div className="fixed bottom-2 left-0 right-0 z-50 md:hidden flex justify-center px-4">
      <div className="bg-[#1c1c1c] rounded-full shadow-2xl px-4 py-3 flex items-center gap-5">
        {navItems.map((item) => (
          <NavLink key={item.name} item={item} />
        ))}
      </div>
    </div>
  );
}