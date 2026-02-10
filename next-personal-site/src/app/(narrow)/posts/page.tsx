import {getPostsMeta} from "@/lib/posts";
import ListItem from "@/components/blog/ListItem";
import {TypographyH1} from "@/components/ui/typography";
import {Tag} from "@/components/ui/tag";
import Link from "next/link";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "All Posts",
    description: "Browse all blog posts about software engineering, Spring Boot, AWS, TypeScript, React, and developer productivity.",
    openGraph: {
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
                <TypographyH1>All posts</TypographyH1>
                <div className="flex flex-wrap gap-2 mt-4">
                    {allTags.map(tag => (
                        <Link key={tag} href={`/tags/${tag}`}>
                            <Tag text={tag}/>
                        </Link>
                    ))}
                </div>
                <ul className="w-full list-none p-0 mt-8 flex flex-col gap-6">
                    {posts.map(post => (
                        <ListItem key={post.id} post={post}/>
                    ))}
                </ul>
            </section>
        </>
    )
}
