import {getPostsMeta} from "@/lib/posts";
import ListItem from "@/components/blog/ListItem";
import {TypographyH1} from "@/components/ui/typography";
import {Tag} from "@/components/ui/tag";
import Link from "next/link";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "All Posts",
    alternates: {canonical: '/posts'},
    description: "Browse all blog posts about software engineering, Spring Boot, AWS, TypeScript, React, and developer productivity.",
    openGraph: {
        images: ['/opengraph-image.png'],
        title: "All Posts",
        description: "Browse all blog posts about software engineering, Spring Boot, AWS, TypeScript, React, and developer productivity.",
    },
};

export default async function PostList() {
    const posts = await getPostsMeta()

    if (!posts) return <p className="mt-10 text-center">Sorry, no posts available.</p>

    const allTags = Array.from(new Set(posts.flatMap(post => post.tags))).sort()

    return (
        <>
            <section className="max-w-3xl mx-auto">
                <p className="page-kicker mb-4">The blog</p>
                <TypographyH1>Writing<span className="text-highlight">.</span></TypographyH1>
                <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">Notes on software, useful tools, and things learned while building.</p>
                <div className="flex flex-wrap gap-2 mt-8" aria-label="Browse by topic">
                    {allTags.map(tag => (
                        <Link key={tag} href={`/tags/${tag}`}>
                            <Tag text={tag}/>
                        </Link>
                    ))}
                </div>
                <ul className="mt-8 w-full list-none divide-y border-y p-0">
                    {posts.map(post => (
                        <ListItem key={post.id} post={post}/>
                    ))}
                </ul>
            </section>
        </>
    )
}
