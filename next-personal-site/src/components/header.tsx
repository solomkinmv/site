"use client";

import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {ThemeToggle} from "@/components/ui/theme-toggle";
import {cn} from "@/lib/utils";

export function Header() {
    const pathname = usePathname();

    return (
        <header className="site-shell flex min-h-24 flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b py-5">
            <Link className="flex min-h-11 items-center gap-2.5" href="/" aria-label="Maksym Solomkin home">
                <Image src="/logo-192.png" alt="" width={192} height={192} className="size-8 dark:invert" />
                <span className="text-sm font-semibold tracking-tight">Maksym Solomkin<span className="text-highlight">.</span></span>
            </Link>
            <div className="flex items-center gap-3 sm:gap-6">
                <nav aria-label="Main navigation" className="flex items-center gap-1 sm:gap-4">
                    {[
                        {href: "/", label: "Home", active: pathname === "/"},
                        {href: "/#projects", label: "Projects", active: pathname.startsWith("/projects/") || pathname.startsWith("/apps/") || pathname === "/leetcode-tree-visualizer"},
                        {href: "/posts", label: "Writing", active: pathname.startsWith("/posts") || pathname.startsWith("/tags/")},
                    ].map(({href, label, active}) => (
                        <Link key={label} href={href} aria-current={active ? (href === "/#projects" ? "location" : "page") : undefined}
                            className={cn("inline-flex min-h-11 items-center px-2 text-sm transition-colors hover:text-foreground", active ? "text-foreground" : "text-muted-foreground")}>
                            {label}
                        </Link>
                    ))}
                </nav>
                <ThemeToggle />
            </div>
        </header>
    );
}
