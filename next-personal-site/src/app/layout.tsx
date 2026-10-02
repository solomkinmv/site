import type {Metadata} from "next";
import {Manrope, Newsreader} from "next/font/google";
import "./globals.css";
import React from "react";
import {cn} from "@/lib/utils";
import {Header} from "@/components/header";
import {Footer} from "@/components/footer";
import {GoogleAnalytics} from "@next/third-parties/google";
import {ThemeProvider} from "@/components/theme-provider";

const fontSans = Manrope({
    subsets: ["latin"],
    variable: "--font-manrope",
    display: "swap",
})
const fontDisplay = Newsreader({
    subsets: ["latin"],
    variable: "--font-newsreader",
    style: ["normal", "italic"],
    display: "swap",
})

export const metadata: Metadata = {
    metadataBase: new URL('https://solomk.in'),
    title: "Maksym Solomkin",
    description: "Software engineering blog by Maksym Solomkin covering Spring Boot, AWS, TypeScript, React, and developer productivity",
    icons: { icon: '/logo-192.png', apple: '/logo-192.png' },
    alternates: {canonical: '/'},
    openGraph: {
        type: 'website',
        locale: 'en_US',
        siteName: 'Maksym Solomkin',
    },
    twitter: {
        card: 'summary_large_image',
        creator: '@solomkinmv',
        images: ['/opengraph-image.png'],
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
            "flex min-h-screen flex-col font-sans antialiased",
            fontSans.variable,
            fontDisplay.variable
        )}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:rounded focus:bg-background focus:p-4 focus:text-foreground">Skip to content</a>
            <Header/>

            {children}

            <Footer/>
        </ThemeProvider>
        <GoogleAnalytics gaId="G-4V433C415C"/>
        </body>
        </html>
    );
}
