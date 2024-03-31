import React from "react";

export default function Layout({
                                   children,
                               }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="flex-1 p-6 md:p-10">
            {children}
        </main>
    )
}
