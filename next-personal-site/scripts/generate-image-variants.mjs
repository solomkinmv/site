import {existsSync, readFileSync, readdirSync} from 'node:fs';
import {mkdir} from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const output = path.resolve('out');
const variant = /(\/[^"'\s,()\\]+)-(\d+)w\.webp/g;
const sources = ['.webp', '.png', '.jpg', '.jpeg'];

const files = readdirSync(output, {recursive: true})
    .filter(file => /\.(html|txt|js)$/.test(file))
    .map(file => readFileSync(path.join(output, file), 'utf8'));

const requested = new Map();
for (const text of files) {
    for (const [url, base, width] of text.matchAll(variant)) requested.set(url, {base, width: Number(width)});
}

// The enlarged article image is rendered client-side, so its full width set is never in the HTML.
const widths = [64, 128, 256, 384, 640, 960, 1280, 1920];
for (const {base} of [...requested.values()]) {
    for (const width of widths) requested.set(`${base}-${width}w.webp`, {base, width});
}

let generated = 0;
for (const [url, {base, width}] of requested) {
    const target = path.join(output, url);
    if (existsSync(target)) continue;
    const source = sources.map(ext => path.join(output, `${base}${ext}`)).find(existsSync);
    if (!source) throw new Error(`No source image for ${url}`);
    await mkdir(path.dirname(target), {recursive: true});
    await sharp(source).resize({width, withoutEnlargement: true}).webp({quality: 80}).toFile(target);
    generated++;
}
console.log(`Generated ${generated} responsive image variants for ${new Set([...requested.values()].map(v => v.base)).size} images.`);
