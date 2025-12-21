import {compileMDX} from 'next-mdx-remote/rsc'
import Video from "@/components/blog/Video";
import CustomImage from "@/components/blog/CustomImage";
import remarkGfm from 'remark-gfm'
import path from "path";
import {access, readFile} from "fs/promises";
import fs from "fs";
import rehypeSlug from 'rehype-slug'
import rehypeStringify from "rehype-stringify";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import {BlogPost, Meta} from "@/lib/types";
import {useMDXComponents} from "@/mdx-components";

const POSTS_FOLDER = path.join(process.cwd(), "posts");

async function readPostFile(slug: string) {
    const filePath = path.resolve(path.join(POSTS_FOLDER, `${slug}.mdx`));

    try {
        await access(filePath);
    } catch (err) {
        return null;
    }

    const fileContent = await readFile(filePath, {encoding: "utf8"});
    return fileContent;
}

export async function getPostByName(fileName: string): Promise<BlogPost | undefined> {
    const rawMDX = await readPostFile(fileName)

    if (!rawMDX) return undefined

    const {frontmatter, content} = await compileMDX<{ title: string, date: string, tags: string[], draft: boolean, summary?: string, description?: string, image?: string }>({
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
                    rehypeStringify,
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

    const id = fileName.replace(/\.mdx$/, '')

    const blogPostObj: BlogPost = {
        meta: {
            id,
            title: frontmatter.title,
            date: frontmatter.date,
            tags: frontmatter.tags,
            draft: frontmatter.draft ?? false,
            summary: frontmatter.summary,
            description: frontmatter.description,
            image: frontmatter.image,
        },
        content,
    }
    return blogPostObj
}

export async function getPostsMeta(): Promise<Meta[] | undefined> {
    const postSlugs = fs.readdirSync(POSTS_FOLDER).map((filename) => {
        return filename.replace(".mdx", "");
    });

    const posts: Meta[] = []

    for (const slug of postSlugs) {
        const post = await getPostByName(slug)
        if (post && !post.meta.draft) {
            const {meta} = post
            posts.push(meta)
        }
    }

    return posts.sort((a, b) => a.date < b.date ? 1 : -1)
}

export async function getPostWithNearestMeta(slug: string): Promise<{
    prev: Meta | null,
    current: BlogPost | null,
    next: Meta | null
}> {
    const postSlugs = fs.readdirSync(POSTS_FOLDER).map((filename) => {
        return filename.replace(".mdx", "");
    });

    const posts: BlogPost[] = []

    for (const slug of postSlugs) {
        const post = await getPostByName(slug)
        if (post && !post.meta.draft) {
            posts.push(post)
        }
    }

    // Sort posts by date in descending order
    posts.sort((a, b) => a.meta.date < b.meta.date ? 1 : -1)

    // Find the index of the current post
    const currentIndex = posts.findIndex(post => post.meta.id === slug)

    // Get the previous, current and next posts
    const prevPost = currentIndex > 0 ? posts[currentIndex - 1].meta : null
    const currentPost = posts[currentIndex] || null
    const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1].meta : null

    return {prev: prevPost, current: currentPost, next: nextPost}
}
