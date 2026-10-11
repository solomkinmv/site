import path from "path";
import {access, readFile} from "fs/promises";
import fs from "fs";
import {parse} from "yaml";
import {Meta} from "@/lib/types";

const POSTS_FOLDER = path.join(process.cwd(), "posts");
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

export async function readPostFile(slug: string) {
    const filePath = path.resolve(path.join(POSTS_FOLDER, `${slug}.mdx`));

    try {
        await access(filePath);
    } catch (err) {
        return null;
    }

    const fileContent = await readFile(filePath, {encoding: "utf8"});
    return fileContent;
}

type Frontmatter = Omit<Meta, "id" | "draft"> & {draft?: boolean}

function isRecord(data: unknown): data is Record<string, unknown> {
    return typeof data === "object" && data !== null && !Array.isArray(data)
}

function isFrontmatter(data: unknown): data is Frontmatter {
    if (!isRecord(data)) return false
    const {title, date, tags} = data
    return typeof title === "string" && title.trim() !== ""
        && typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)
        && Array.isArray(tags) && tags.every((tag) => typeof tag === "string")
}

const metaCache = new Map<string, Promise<Meta | undefined>>()

export function getPostMeta(slug: string): Promise<Meta | undefined> {
    let meta = metaCache.get(slug)
    if (!meta) {
        meta = readPostMeta(slug)
        metaCache.set(slug, meta)
    }
    return meta
}

async function readPostMeta(slug: string): Promise<Meta | undefined> {
    const rawMDX = await readPostFile(slug)

    if (!rawMDX) return undefined

    const frontmatter: unknown = parse(rawMDX.match(FRONTMATTER)?.[1] ?? "")

    if (!isFrontmatter(frontmatter)) {
        throw new Error(`Invalid frontmatter in posts/${slug}.mdx: title, date (YYYY-MM-DD) and tags (string[]) are required`)
    }

    return {
        id: slug,
        title: frontmatter.title,
        date: frontmatter.date,
        tags: frontmatter.tags,
        draft: frontmatter.draft ?? false,
        summary: frontmatter.summary,
        description: frontmatter.description,
        image: frontmatter.image,
        cardImage: frontmatter.cardImage,
        cardImagePosition: frontmatter.cardImagePosition,
    }
}

function getPostSlugs(): string[] {
    return fs.readdirSync(POSTS_FOLDER)
        .filter((filename) => filename.endsWith(".mdx"))
        .map((filename) => filename.replace(/\.mdx$/, ""));
}

export async function getPostsMeta(): Promise<Meta[]> {
    const posts = await Promise.all(getPostSlugs().map(getPostMeta))

    return posts
        .flatMap((meta) => meta && !meta.draft ? [meta] : [])
        .sort((a, b) => a.date < b.date ? 1 : -1)
}
