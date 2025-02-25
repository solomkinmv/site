import {getPostsMeta} from "@/lib/posts"
import Link from "next/link"
import ListItem from "@/components/blog/ListItem";
import {TypographyH2} from "@/components/ui/typography";

export const revalidate = 86400

type Props = {
    params: Promise<{
        tag: string
    }>
}

export async function generateStaticParams() {
    const posts = await getPostsMeta() //deduped!

    if (!posts) return []

    const tags = new Set(posts.map(post => post.tags).flat())

    return Array.from(tags).map((tag) => ({tag}))
}

export async function generateMetadata({params}: Props) {
    const { tag } = await params;
    return {
        title: `Posts about ${tag}`
    }
}

export default async function TagPostList({params}: Props) {
    const { tag } = await params;
    const posts = await getPostsMeta() //deduped!

    if (!posts) return <p className="mt-10 text-center">Sorry, no posts available.</p>

    const tagPosts = posts.filter(post => post.tags.includes(tag))

    if (!tagPosts.length) {
        return (
            <div className="text-center">
                <p className="mt-10">Sorry, no posts for that keyword.</p>
                <Link href="/next-personal-site/public">Back to Home</Link>
            </div>
        )
    }

    return (
        <>
            <section className="prose prose-gray max-w-3xl mx-auto dark:prose-invert">
                <TypographyH2>Results for: #{tag}</TypographyH2>
                <ul className="w-full list-none p-0">
                    {tagPosts.map(post => (
                        <ListItem key={post.id} post={post}/>
                    ))}
                </ul>
            </section>
        </>
    )
}
