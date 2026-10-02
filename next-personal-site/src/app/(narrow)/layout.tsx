import React from "react";

export default function Layout({
                                   children,
                               }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main id="main-content" tabIndex={-1} className="flex-1 min-w-0 break-words p-6 md:p-10">
            {children}
        </main>
    )
}
