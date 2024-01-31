import remarkGfm from 'remark-gfm'
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Configure `pageExtensions`` to include MDX files
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  // Optionally, add any other Next.js config below
}

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [
      // Adds support for GitHub Flavored Markdown
      remarkGfm,
    ],
    rehypePlugins: [],
  },
})

// Merge MDX config with Next.js config
export default withMDX(nextConfig)
