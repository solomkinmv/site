"use client";

import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {cn} from "@/lib/utils";

export function Header() {
    const pathname = usePathname();

    return (
        <header className="site-shell flex min-h-24 flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b py-5">
            <Link className="group flex min-h-11 items-center gap-2.5 focus-visible:outline-none" href="/" aria-label="Maksym Solomkin home">
                <Image src="/logo-ms-192.png" alt="" width={192} height={192} className="size-8 shrink-0" />
                <span className="text-sm font-semibold tracking-tight group-focus-visible:underline group-focus-visible:decoration-highlight group-focus-visible:decoration-2 group-focus-visible:underline-offset-4">Maksym Solomkin<span className="text-brand" aria-hidden="true">.</span></span>
            </Link>
            <nav aria-label="Main navigation" className="flex items-center gap-1 sm:gap-4">
                {[
                    {href: "/", label: "Home", active: pathname === "/"},
                    {href: "/#projects", label: "Projects", active: pathname.startsWith("/projects/") || pathname.startsWith("/apps/") || pathname === "/leetcode-tree-visualizer"},
                    {href: "/posts", label: "Writing", active: pathname.startsWith("/posts") || pathname.startsWith("/tags/")},
                ].map(({href, label, active}) => (
                    <Link key={label} href={href} aria-current={active ? (href === "/#projects" ? "location" : "page") : undefined}
                        className={cn("inline-flex min-h-11 items-center px-2 text-sm transition-colors hover:text-highlight", active ? "text-highlight" : "text-muted-foreground")}>
                        {label}
                    </Link>
                ))}
            </nav>
        </header>
    );
}
