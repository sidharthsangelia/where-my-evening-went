import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function archive() {
  return (
    <div>
      <h1 className="text-red-600">Archive Page</h1>
      <Link href="/record"><Button>Go to Record Page</Button></Link>
    </div>
  );
}
