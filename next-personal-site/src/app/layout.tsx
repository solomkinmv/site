import type {Metadata} from "next";
import {Inter as FontSans} from "next/font/google";
import "./globals.css";
import React from "react";
import {cn} from "@/lib/utils";
import {Header} from "@/components/header";
import {Footer} from "@/components/footer";
import {GoogleAnalytics} from "@next/third-parties/google";
import {ThemeProvider} from "@/components/theme-provider";

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
        <html lang="en" suppressHydrationWarning>
        <body className={cn(
            "flex flex-col min-h-screen bg-white dark:bg-gray-900 font-sans antialiased",
            fontSans.variable
        )}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <Header/>

            {children}

            <Footer/>
        </ThemeProvider>
        <GoogleAnalytics gaId="G-4V433C415C"/>
        </body>
        </html>
    );
}
