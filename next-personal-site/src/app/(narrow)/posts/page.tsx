import {getPostsMeta} from "@/lib/posts";
import ListItem from "@/components/blog/ListItem";
import {TypographyH2} from "@/components/ui/typography";

export default async function PostList() {
    const posts = await getPostsMeta()

    if (!posts) return <p className="mt-10 text-center">Sorry, no posts available.</p>

    return (
        <>
            <section className="prose prose-gray max-w-3xl mx-auto dark:prose-invert">
                <TypographyH2>All posts</TypographyH2>
                <ul className="w-full list-none p-0">
                    {posts.map(post => (
                        <ListItem key={post.id} post={post}/>
                    ))}
                </ul>
            </section>
        </>
    )
}
