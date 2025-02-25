import {MetadataRoute} from 'next'
import {getPostsMeta} from "@/lib/posts";

export const dynamic = "force-static";

const ChangeFrequency = {
    ALWAYS: 'always',
    HOURLY: 'hourly',
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    YEARLY: 'yearly',
    NEVER: 'never',
} as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const sitePages = [
        {
            url: 'https://solomk.in',
            lastModified: new Date(),
            changeFrequency: ChangeFrequency.WEEKLY,
            priority: 1,
        },
        {
            url: 'https://solomk.in/posts',
            lastModified: new Date(),
            changeFrequency: ChangeFrequency.WEEKLY,
            priority: 0.5,
        },
        {
            url: 'https://solomk.in/leetcode-tree-visualizer',
            lastModified: new Date(),
            changeFrequency: ChangeFrequency.WEEKLY,
            priority: 0.9,
        }
    ];

    const postsMeta = await getPostsMeta();
    const tags = new Set<string>();
    postsMeta?.forEach(postMeta => {
        postMeta.tags.forEach(tag => tags.add(tag));
        sitePages.push({
            url: `https://solomk.in/posts/${postMeta.id}`,
            lastModified: new Date(postMeta.date),
            changeFrequency: ChangeFrequency.WEEKLY,
            priority: 0.8,
        })
    })

    tags.forEach(tag => {
        sitePages.push({
            url: `https://solomk.in/tags/${tag}`,
            lastModified: new Date(),
            changeFrequency: ChangeFrequency.WEEKLY,
            priority: 0.5,
        })
    })

    console.log("Generated sitemap: ", sitePages);
    return sitePages;
}
