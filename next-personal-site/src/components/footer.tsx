import React from 'react';
import Link from "next/link";

export const Footer = () => {
    return (
        <footer className="site-shell mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t py-6 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Maksym Solomkin</p>
            <nav aria-label="Social links" className="flex flex-wrap gap-x-5">
                <Link className="inline-flex min-h-11 items-center transition-colors hover:text-foreground" href="https://github.com/solomkinmv">
                    GitHub
                </Link>
                <Link className="inline-flex min-h-11 items-center transition-colors hover:text-foreground" href="https://twitter.com/solomkinmv">
                    Twitter
                </Link>
                <Link className="inline-flex min-h-11 items-center transition-colors hover:text-foreground" href="https://mastodon.social/@solomkinmv" rel="me">
                    Mastodon
                </Link>
            </nav>
        </footer>
    );
};
