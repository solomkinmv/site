import {compileMDX} from 'next-mdx-remote/rsc'
import Video from "@/components/blog/Video";
import CustomImage from "@/components/blog/CustomImage";
import remarkGfm from 'remark-gfm'
import path from "path";
import {access, readFile} from "fs/promises";
import fs from "fs";
import rehypeSlug from 'rehype-slug'
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

const postCache = new Map<string, Promise<BlogPost | undefined>>()

export function getPostByName(fileName: string): Promise<BlogPost | undefined> {
    let post = postCache.get(fileName)
    if (!post) {
        post = compilePost(fileName)
        postCache.set(fileName, post)
    }
    return post
}

async function compilePost(fileName: string): Promise<BlogPost | undefined> {
    const rawMDX = await readPostFile(fileName)

    if (!rawMDX) return undefined

    const {frontmatter, content} = await compileMDX<Omit<Meta, "id">>({
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
            cardImage: frontmatter.cardImage,
            cardImagePosition: frontmatter.cardImagePosition,
        },
        content,
    }
    return blogPostObj
}

function getPostSlugs(): string[] {
    return fs.readdirSync(POSTS_FOLDER)
        .filter((filename) => filename.endsWith(".mdx"))
        .map((filename) => filename.replace(/\.mdx$/, ""));
}

export async function getPostsMeta(): Promise<Meta[]> {
    const posts = await Promise.all(getPostSlugs().map(getPostByName))

    return posts
        .flatMap((post) => post && !post.meta.draft ? [post.meta] : [])
        .sort((a, b) => a.date < b.date ? 1 : -1)
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
