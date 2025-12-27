import React from 'react';
import Image from "next/image";
import Link from 'next/link';
import {GithubIcon, TwitterIcon} from "@/components/ui/icons";
import {ThemeToggle} from "@/components/ui/theme-toggle";
import {Home, FileText, TreeDeciduous} from "lucide-react";

export const Header = () => {
    return (
        <header className="flex items-center justify-between p-4 md:p-6 border-b">
            <Link className="flex items-center gap-2" href="/">
                <Image src="/logo-192.png" alt="Icon" className="h-6 w-6" width={192} height={192} />
                <span className="hidden md:inline text-lg font-semibold">Maksym Solomkin</span>
            </Link>
            <nav className="flex gap-2 md:gap-4">
                <Link className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50" href="/">
                    <Home className="h-5 w-5 md:hidden" aria-hidden="true" />
                    <span className="hidden md:inline">Home</span>
                    <span className="sr-only md:hidden">Home</span>
                </Link>
                <Link className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50" href="/posts">
                    <FileText className="h-5 w-5 md:hidden" aria-hidden="true" />
                    <span className="hidden md:inline">Posts</span>
                    <span className="sr-only md:hidden">Posts</span>
                </Link>
                <Link className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50" href="/leetcode-tree-visualizer">
                    <TreeDeciduous className="h-5 w-5 md:hidden" aria-hidden="true" />
                    <span className="hidden md:inline">LeetCode Tree Visualizer</span>
                    <span className="sr-only md:hidden">LeetCode Tree Visualizer</span>
                </Link>
            </nav>
            <div className="flex items-center space-x-2 md:space-x-4">
                <Link className="text-gray-900 dark:text-gray-100 hover:underline" href="https://twitter.com/solomkinmv" aria-label="Twitter">
                    <TwitterIcon className="h-5 w-5" aria-hidden="true" />
                </Link>
                <Link className="text-gray-900 dark:text-gray-100 hover:underline" href="https://github.com/solomkinmv" aria-label="GitHub">
                    <GithubIcon className="h-5 w-5" aria-hidden="true" />
                </Link>
                <ThemeToggle />
            </div>
        </header>
    );
};
