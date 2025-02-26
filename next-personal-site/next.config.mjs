import remarkGfm from 'remark-gfm'
import createMDX from '@next/mdx'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from "rehype-stringify";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  reactStrictMode: true,
  experimental: {
    mdxRs: false,
  }
}

const withMDX = createMDX({
  options: {
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
})

export default withMDX(nextConfig)
