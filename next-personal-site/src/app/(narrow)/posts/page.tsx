import {getPostsMeta} from "@/lib/posts";
import Link from "next/link";
import ListItem from "@/components/blog/ListItem";

export default async function PostList() {
    const posts = await getPostsMeta() //deduped!

    if (!posts) return <p className="mt-10 text-center">Sorry, no posts available.</p>

    return (
        <>
            <h2 className="text-3xl mt-4 mb-0">All posts</h2>
            <section className="mt-6 mx-auto max-w-2xl">
                <ul className="w-full list-none p-0">
                    {posts.map(post => (
                        <ListItem key={post.id} post={post} />
                    ))}
                </ul>
            </section>
        </>
    )
}
