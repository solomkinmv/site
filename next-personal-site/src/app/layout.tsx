import type {Metadata} from "next";
import {Inter as FontSans} from "next/font/google";
import "./globals.css";
import React from "react";
import {cn} from "@/lib/utils";
import {Header} from "@/components/header";
import {Footer} from "@/components/footer";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
})

export const metadata: Metadata = {
    title: "Maksym Solomkin",
    description: "Personal website of Maksym Solomkin",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
        )}>
        <Header/>
        <main
            className={cn('blog-content', 'flex', 'flex-col', 'justify-center', 'p-4', 'max-w-3xl', 'mx-auto')}>
            {children}
        </main>
        <Footer/>
        </body>
        </html>
    );
}
