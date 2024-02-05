import {compileMDX} from "next-mdx-remote/rsc";
import path from "path";
import {access, readFile} from "fs/promises";
import {notFound} from "next/navigation";
import * as fs from "fs";
import {getPostByName, getPostsMeta} from "@/lib/posts";
import getFormattedDate from "@/lib/getFormattedDate";
import Link from "next/link";
import {Tag} from "@/components/ui/tag";

export const revalidate = 86400

type Props = {
    params: {
        slug: string
    }
}

export async function generateStaticParams() {
    const posts = await getPostsMeta() //deduped!

    if (!posts) return []

    return posts.map((post) => ({
        slug: post.id
    }))
}

export async function generateMetadata({ params: { slug } }: Props) {

    const post = await getPostByName(`${slug}.mdx`) //deduped!

    if (!post) {
        return {
            title: 'Post Not Found'
        }
    }

    return {
        title: post.meta.title,
    }
}

export default async function Post({ params: { slug } }: Props) {

    const post = await getPostByName(slug) //deduped!

    if (!post) notFound()

    const { meta, content } = post

    const pubDate = getFormattedDate(meta.date)

    const tags = meta.tags.map((tag, i) => (
        <Link key={i} href={`/tags/${tag}`}><Tag text={tag}/></Link>
    ))

    return (
        <>
            <h2 className="text-3xl mt-4 mb-0">{meta.title}</h2>
            <p className="mt-0 text-sm">
                {pubDate}
            </p>
            <article>
                {content}
            </article>
            <section>
                <h3>Related:</h3>
                <div className="flex flex-row gap-4">
                    {tags}
                </div>
            </section>
            <p className="mb-10">
                <Link href="/next-personal-site/public">← Back to home</Link>
            </p>
        </>
    )
}
