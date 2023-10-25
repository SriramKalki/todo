"use client";

import { usePathname } from "next/navigation";
import * as React from "react";
import Link from "next/link";
import { Camera, ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";

export function MainNav() {
  const pathname = usePathname();

  return (
    <>
      <div className="mr-4 hidden md:flex">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <ListTodo />
            <span className="hidden font-bold sm:inline-block">Todo+</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname?.startsWith("/console")
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              Home
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
