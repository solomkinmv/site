import React from 'react';
import {cn} from "@/lib/utils";
import Image from "next/image";
import Link from 'next/link';
import {Button} from "@/components/ui/button";

export const Header = () => {
    return (
        <header className="flex items-center justify-between p-6 border-b">
            <Link className="flex items-center gap-2" href="#">
                {/*<MountainIcon className="h-6 w-6"/>*/}
                <Image src="/logo-192.png" alt="Icon" className="h-6 w-6" width={192} height={192} />
                <span className="text-lg font-semibold">Maksym Solomkin</span>
            </Link>
            <nav className="flex gap-4">
                <Link className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50" href="/">
                    Home
                </Link>
                <Link className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50" href="/posts">
                    Posts
                </Link>
                <Link className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50" href="/tags">
                    Tags
                </Link>
            </nav>
            <Button className="rounded-full" size="icon" variant="outline">
                <MoonIcon className="h-6 w-6"/>
                <span className="sr-only">Toggle theme</span>
            </Button>
        </header>
    );
};

function MoonIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
    )
}
