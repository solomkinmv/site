/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    deviceSizes: [640, 960, 1280, 1920],
    imageSizes: [64, 128, 256, 384],
  },
  reactStrictMode: true,
}

export default nextConfig
