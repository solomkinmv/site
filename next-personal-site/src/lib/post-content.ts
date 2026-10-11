import {compileMDX} from 'next-mdx-remote/rsc'
import Video from "@/components/blog/Video";
import CustomImage from "@/components/blog/CustomImage";
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypePrettyCode from "rehype-pretty-code";
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import {BlogPost, Meta} from "@/lib/types";
import {useMDXComponents} from "@/mdx-components";
import {getPostMeta, getPostsMeta, readPostFile} from "@/lib/posts";

const postCache = new Map<string, Promise<BlogPost | undefined>>()

export function getPostByName(slug: string): Promise<BlogPost | undefined> {
    let post = postCache.get(slug)
    if (!post) {
        post = compilePost(slug)
        postCache.set(slug, post)
    }
    return post
}

async function compilePost(slug: string): Promise<BlogPost | undefined> {
    const [meta, rawMDX] = await Promise.all([getPostMeta(slug), readPostFile(slug)])

    if (!meta || !rawMDX) return undefined

    const {content} = await compileMDX({
        source: rawMDX,
        // eslint-disable-next-line react-hooks/rules-of-hooks
        components: useMDXComponents({
            Video,
            CustomImage,
        }),
        options: {
            parseFrontmatter: true,
            mdxOptions: {
                remarkPlugins: [
                    remarkGfm,
                ],
                rehypePlugins: [
                    [rehypePrettyCode, {
                        theme: "catppuccin-frappe",
                    }],
                    rehypeSlug,
                    [rehypeAutolinkHeadings, {
                        behavior: 'wrap'
                    }],
                ],
            },
        }
    })

    return {meta, content}
}

export async function getPostWithNearestMeta(slug: string): Promise<{
    prev: Meta | null,
    current: BlogPost | null,
    next: Meta | null
}> {
    const posts = await getPostsMeta()
    const currentIndex = posts.findIndex(post => post.id === slug)
    const current = currentIndex === -1 ? null : await getPostByName(slug) ?? null

    return {
        prev: currentIndex > 0 ? posts[currentIndex - 1] : null,
        current,
        next: currentIndex !== -1 && currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null,
    }
}
