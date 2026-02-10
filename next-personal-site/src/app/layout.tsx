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
    metadataBase: new URL('https://solomk.in'),
    title: "Maksym Solomkin",
    description: "Software engineering blog by Maksym Solomkin covering Spring Boot, AWS, TypeScript, React, and developer productivity",
    openGraph: {
        type: 'website',
        locale: 'en_US',
        siteName: 'Maksym Solomkin',
    },
    twitter: {
        card: 'summary_large_image',
        creator: '@solomkinmv',
    },
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
