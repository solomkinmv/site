import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  reactStrictMode: true,
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      'remark-gfm',
    ],
    rehypePlugins: [
      'rehype-stringify',
      ['rehype-pretty-code', {
        theme: "catppuccin-frappe",
      }],
      'rehype-slug',
      ['rehype-autolink-headings', {
        behavior: 'wrap'
      }],
    ],
  },
})

export default withMDX(nextConfig)
