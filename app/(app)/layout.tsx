// app/(app)/layout.tsx
import MobileHeader from "@/components/MobileHeader";
import MobileNav from "@/components/MobileNav";


export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
          {/* <header className="flex justify-end items-center p-4 gap-4 h-16">
            <SignedOut>
              <SignInButton />
              <SignUpButton>
                <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header> */}
      <MobileHeader />
      <main className="pt-[header-height] pb-[nav-height]">
        {children}
      </main>
      <MobileNav/>
    </div>
  );
}