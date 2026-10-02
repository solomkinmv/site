import React from "react";

export default function Layout({
                                   children,
                               }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main id="main-content" tabIndex={-1} className="site-shell min-w-0 flex-1 break-words py-12 sm:py-16">
            {children}
        </main>
    )
}
