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
            "flex flex-col min-h-screen bg-white dark:bg-gray-900 font-sans antialiased",
            fontSans.variable
        )}>
        <Header/>

        {children}

        <Footer/>
        </body>
        </html>
);
}
