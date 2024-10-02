'use client'

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Learn", href: "/learn" },
    { name: "Statistics", href: "/statistics" },
    { name: "Challenges", href: "/challenges" },
];

export function NavButton({ href, children, isActive }: { href: string; children: ReactNode; isActive: boolean; }) {

    return (
        <Link href={href} className={cn(
            "text-sm  px-4 py-2",
            "rounded-md",
            {
                "border-b-4 border-purple-400": isActive,
                "hover:bg-purple-100 hover:border-b-4 hover:border-purple-400 rounded-lg": !isActive
            }
        )}>
            {children}
        </Link>
    );
}

export function NavItems() {

    const pathname = usePathname()

    return (
        <nav className="w-full md:w-auto text-gray-800">
            <ul className="flex flex-wrap gap-6 p-2">
                {navLinks.map((link) => (
                    <li key={link.name}>
                        <NavButton href={link.href} isActive={link.href === pathname}>{link.name}</NavButton>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
