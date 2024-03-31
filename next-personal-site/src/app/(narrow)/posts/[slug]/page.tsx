import {notFound} from "next/navigation";
import {getPostByName, getPostsMeta, getPostWithNearestMeta} from "@/lib/posts";
import getFormattedDate from "@/lib/getFormattedDate";
import Link from "next/link";
import {Tag} from "@/components/ui/tag";
import {TypographyH1} from "@/components/ui/typography";

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

export async function generateMetadata({params: {slug}}: Props) {

    const post = await getPostByName(`${slug}`) //deduped!

    if (!post) {
        return {
            title: 'Post Not Found'
        }
    }

    return {
        title: post.meta.title,
    }
}

export default async function Post({params: {slug}}: Props) {

    const {prev, current, next} = await getPostWithNearestMeta(slug)

    if (!current) notFound()

    const {meta, content} = current

    const pubDate = getFormattedDate(meta.date)

    const tags = meta.tags.map((tag, i) => (
        <Link key={i} href={`/tags/${tag}`}><Tag text={tag}/></Link>
    ))

    return (
        <>
            <article className="prose prose-gray max-w-3xl mx-auto dark:prose-invert">
                <div className="space-y-2 not-prose">
                    <TypographyH1>{meta.title}</TypographyH1>
                    <p className="text-gray-500 dark:text-gray-400">Posted on {pubDate}</p>
                </div>

                {content}

                <section>
                    <div className="flex flex-row gap-4 mt-8">
                        {tags}
                    </div>
                </section>

                <div className="flex justify-between mt-8">
                    {prev &&
                      <Link className="text-gray-900 dark:text-gray-100 hover:underline" href={`/posts/${prev?.id}`}>
                        ←&nbsp;{prev.title}
                      </Link>}
                    {next &&
                      <Link className="text-gray-900 dark:text-gray-100 hover:underline" href={`/posts/${next?.id}`}>
                          {next.title}&nbsp;→
                      </Link>}
                </div>
            </article>


        </>
    )
}
