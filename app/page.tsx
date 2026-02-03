import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1 className="font-bold text-4xl">
        Yo Welcome to Where My Evening Went
      </h1>
      <Link href="/upload">
        <Button>Lets Go🚀</Button>
      </Link>
    </main>
  );
}
