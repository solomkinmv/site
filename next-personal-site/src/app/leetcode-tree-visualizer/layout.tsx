import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "LeetCode Tree Visualizer",
    alternates: {canonical: '/leetcode-tree-visualizer'},
    description: "Visualize and compare binary trees from LeetCode problems. Supports large trees, long node text, and diff visualization between actual and expected answers.",
    openGraph: {
        images: ['/opengraph-image.png'],
        title: "LeetCode Tree Visualizer",
        description: "Visualize and compare binary trees from LeetCode problems. Supports large trees, long node text, and diff visualization between actual and expected answers.",
    },
};

export default function LeetcodeTreeVisualizerLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}
