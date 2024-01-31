import {compileMDX} from 'next-mdx-remote/rsc'
import rehypeSlug from 'rehype-slug'
import Video from "@/components/blog/Video";
import CustomImage from "@/components/blog/CustomImage";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import path from "path";
import {access, readFile} from "fs/promises";
import fs from "fs";
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

    const {frontmatter, content} = await compileMDX<{ title: string, date: string, tags: string[] }>({
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
                    // remarkGfm,
                ],
                rehypePlugins: [
                    // rehypeHighlight(),
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
        meta: {id, title: frontmatter.title, date: frontmatter.date, tags: frontmatter.tags},
        content
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
        if (post) {
            const {meta} = post
            posts.push(meta)
        }
    }

    return posts.sort((a, b) => a.date < b.date ? 1 : -1)
}
