// app/(app)/layout.tsx
import MobileHeader from "@/components/MobileHeader";
import MobileNav from "@/components/MobileNav";


export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
        
   
      <main className="pt-[header-height] pb-[nav-height]">
        {children}
      </main>
      <MobileNav/>
    </div>
  );
}