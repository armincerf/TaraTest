'use client';

import { cn } from "@/lib/utils";
import { Link } from "lucide-react";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";


export function NavButton({ href, children }: { href: string; children: ReactNode; }) {

    const pathname = usePathname()
    return (
      <Link href={href} className={cn(
        "text-sm text-black px-4 py-2",
        "rounded-md",
        {
          "border-b-4 border-purple-400": pathname === href,
          "hover:bg-purple-100 hover:border-b-4 hover:border-purple-400 rounded-lg": pathname !== href
        }
      )}>
        {children}
      </Link>
    );
  }