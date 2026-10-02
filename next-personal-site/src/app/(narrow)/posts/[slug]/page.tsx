import {notFound} from "next/navigation";
import {getPostByName, getPostsMeta, getPostWithNearestMeta} from "@/lib/posts";
import getFormattedDate from "@/lib/getFormattedDate";
import Link from "next/link";
import {Tag} from "@/components/ui/tag";
import {TypographyH1} from "@/components/ui/typography";
import {TableOfContents} from "@/components/blog/TableOfContents";

export const revalidate = 86400

type Props = {
    params: Promise<{
        slug: string
    }>
}

export async function generateStaticParams() {
    const posts = await getPostsMeta() //deduped!

    if (!posts) return []

    return posts
        .map((post) => ({
        slug: post.id
    }))
}

export async function generateMetadata({params}: Props) {
    const { slug } = await params;
    const post = await getPostByName(`${slug}`) //deduped!

    if (!post) {
        return {
            title: 'Post Not Found'
        }
    }

    const description = post.meta.description ?? post.meta.summary;
    const image = post.meta.image ?? '/opengraph-image.png';

    return {
        title: post.meta.title,
        description,
        alternates: {canonical: `/posts/${encodeURIComponent(slug)}`},
        openGraph: {
            type: 'article',
            title: post.meta.title,
            description,
            url: `/posts/${slug}`,
            images: [{ url: image }],
            publishedTime: post.meta.date,
            tags: post.meta.tags,
        },
        twitter: {
            title: post.meta.title,
            description,
            images: [image],
        },
    }
}

export default async function Post({params}: Props) {
    const { slug } = await params;
    const {prev, current, next} = await getPostWithNearestMeta(slug)

    if (!current) notFound()

    const {meta, content} = current

    const pubDate = getFormattedDate(meta.date)

    const tags = meta.tags.map((tag, i) => (
        <Link key={i} href={`/tags/${tag}`}><Tag text={tag}/></Link>
    ))

    return (
        <>
            <TableOfContents />
            <article className="prose reading-prose max-w-3xl mx-auto">
                <div className="not-prose mb-10 border-b pb-8">
                    <Link href="/posts" className="mb-6 inline-flex min-h-11 items-center text-sm text-muted-foreground hover:text-foreground">← All writing</Link>
                    <p className="page-kicker mb-4">Engineering notes</p>
                    <TypographyH1>{meta.title}</TypographyH1>
                    <p className="mt-4 text-sm text-muted-foreground"><time dateTime={meta.date}>{pubDate}</time> · Maksym Solomkin</p>
                </div>

                {content}

                <section>
                    <div className="flex flex-wrap gap-4 mt-8">
                        {tags}
                    </div>
                </section>

                <div className="not-prose grid grid-cols-2 gap-6 mt-10 border-t pt-8 text-sm">
                    {prev &&
                      <Link className="min-w-0 break-words text-muted-foreground hover:text-foreground" href={`/posts/${prev?.id}`}>
                        ←&nbsp;{prev.title}
                      </Link>}
                    {next &&
                      <Link className="col-start-2 min-w-0 break-words text-right text-muted-foreground hover:text-foreground" href={`/posts/${next?.id}`}>
                          {next.title}&nbsp;→
                      </Link>}
                </div>
            </article>
        </>
    )
}
