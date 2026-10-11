import type {ImageLoaderProps} from "next/image";

const RASTER = /\.(png|jpe?g|webp)$/i;

// Widths are generated after `next build` by scripts/generate-image-variants.mjs.
export default function imageLoader({src, width}: ImageLoaderProps) {
    if (process.env.NODE_ENV === "development" || !src.startsWith("/") || !RASTER.test(src)) return src;
    return src.replace(RASTER, `-${width}w.webp`);
}
