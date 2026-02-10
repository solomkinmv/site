import {getPostsMeta} from "@/lib/posts"
import Link from "next/link"
import ListItem from "@/components/blog/ListItem";
import {TypographyH1} from "@/components/ui/typography";

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
        title: `Posts about ${tag}`,
        description: `Browse blog posts tagged with "${tag}" covering software engineering topics and tutorials.`,
        openGraph: {
            title: `Posts about ${tag}`,
            description: `Browse blog posts tagged with "${tag}" covering software engineering topics and tutorials.`,
        },
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
                <Link href="/">Back to Home</Link>
            </div>
        )
    }

    return (
        <>
            <section className="max-w-3xl mx-auto">
                <TypographyH1>Results for: #{tag}</TypographyH1>
                <ul className="w-full list-none p-0 mt-8 flex flex-col gap-6">
                    {tagPosts.map(post => (
                        <ListItem key={post.id} post={post}/>
                    ))}
                </ul>
            </section>
        </>
    )
}
