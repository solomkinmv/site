import assert from 'node:assert/strict';
import {readFileSync, readdirSync, statSync} from 'node:fs';
import path from 'node:path';

const output = path.resolve('out');
const pages = readdirSync(output, {recursive: true}).filter(file => file.endsWith('.html'));
assert.ok(pages.length > 0, 'Run npm run build before checking the export.');

function checkPath(url, source) {
    const file = path.join(output, decodeURIComponent(url.pathname));
    assert.ok([file, `${file}.html`, path.join(file, 'index.html')].some(candidate =>
        statSync(candidate, {throwIfNoEntry: false})?.isFile()
    ), `${source}: missing local target ${url.pathname}`);
}

for (const file of pages) {
    const html = readFileSync(path.join(output, file), 'utf8');
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(ids.length, new Set(ids).size, `${file}: duplicate IDs`);
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `${file}: expected one h1`);
    if (['404.html', '_not-found.html'].includes(file)) {
        assert.match(html, /<title>Page Not Found<\/title>/, `${file}: incorrect recovery title`);
        assert.match(html, /<meta name="robots" content="noindex"/, `${file}: missing noindex`);
        assert.doesNotMatch(html, /<link rel="canonical"/, `${file}: recovery page must not claim a canonical`);
    } else {
        const route = file === 'index.html' ? '/' : `/${file.slice(0, -5)}`;
        const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
        assert.ok(canonical, `${file}: missing canonical URL`);
        assert.equal(new URL(canonical).href,
            new URL(route, 'https://solomk.in').href, `${file}: incorrect canonical URL`);
        for (const name of ['og:image', 'twitter:image']) {
            const image = html.match(new RegExp(`<meta (?:property|name)="${name}" content="([^"]+)"`))?.[1];
            assert.ok(image, `${file}: missing ${name}`);
            checkPath(new URL(image), file);
        }
    }
    for (const [image] of html.matchAll(/<img\b[^>]*>/g)) {
        assert.ok(/\bwidth="\d+"/.test(image) && /\bheight="\d+"/.test(image), `${file}: image dimensions missing`);
    }
    for (const match of html.matchAll(/<(?:a|img|video|script|link)\b[^>]*\b(?:href|src)="([^"]+)"/g)) {
        const target = match[1];
        const url = new URL(target, 'https://solomk.in');
        if (url.origin !== 'https://solomk.in') continue;
        if (target.startsWith('#')) {
            assert.ok(ids.includes(decodeURIComponent(url.hash.slice(1))), `${file}: missing anchor ${target}`);
        } else {
            checkPath(url, file);
        }
    }
}

const manifest = JSON.parse(readFileSync(path.join(output, 'manifest.webmanifest'), 'utf8'));
for (const icon of manifest.icons) checkPath(new URL(icon.src, 'https://solomk.in'), 'manifest');
const sitemap = readFileSync(path.join(output, 'sitemap.xml'), 'utf8');
for (const [, url] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) checkPath(new URL(url), 'sitemap');
console.log(`Checked ${pages.length} exported pages: links, assets, anchors, headings, image dimensions, canonical and sharing metadata, manifest and sitemap.`);
