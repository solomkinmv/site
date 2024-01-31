import React from 'react';
import {cn} from "@/lib/utils";
import Image from "next/image";
import Link from 'next/link';

export const Header = () => {
    return (
        <header className={cn('flex', 'justify-between', 'items-center', 'h-12', 'px-4', 'bg-gray-800', 'text-white')}>
            <div className={cn('flex', 'items-center')}>
                <Image src="/logo-192.png" width={192} height={192} alt="Icon" className={cn('h-8', 'w-8', 'mr-2')} />
                <span>Maksym Solomkin</span>
            </div>
            <nav>
                <ul className={cn('flex', 'space-x-4')}>
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/posts">Blog</Link></li>
                    <li><Link href="/tags">Tags</Link></li>
                    <li><Link href="https://github.com/solomkinmv">GitHub</Link></li>
                </ul>
            </nav>
        </header>
    );
};
