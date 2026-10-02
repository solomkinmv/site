import assert from 'node:assert/strict';
import {readFileSync, readdirSync, statSync} from 'node:fs';
import path from 'node:path';

const output = path.resolve('out');
const pages = readdirSync(output, {recursive: true}).filter(file => file.endsWith('.html'));
assert.ok(pages.length > 0, 'Run npm run build before checking the export.');

const home = readFileSync(path.join(output, 'index.html'), 'utf8');
const shortcuts = readFileSync(path.join(output, 'posts/auto-mute-iphone-at-work.html'), 'utf8');
const imageRow = shortcuts.match(/<div data-slot="image-row"[^>]*>([\s\S]*?)<\/div>/)?.[1];
assert.equal([...imageRow?.matchAll(/<img\b/g) ?? []].length, 2, 'Article: image row must render both screenshots.');
assert.equal([...imageRow?.matchAll(/aria-label="Enlarge /g) ?? []].length, 2, 'Article: both screenshots must offer enlargement.');
for (const project of ['polidict', 'hotkys', 'medical-codes', 'leetcode-tree-visualizer']) {
    assert.ok(home.includes(`id="${project}"`), `Homepage: missing project ${project}`);
}
const recentWriting = home.match(/<section\b[^>]*aria-labelledby="writing-title"[^>]*>([\s\S]*?)<\/section>/)?.[1];
assert.ok(recentWriting, 'Homepage: writing must be discoverable.');
assert.equal([...recentWriting.matchAll(/<li\b/g)].length, 3, 'Homepage: expected three recent posts.');
for (const [, href] of recentWriting.matchAll(/<a\b[^>]*href="(\/posts\/[^"#]+)"/g)) {
    assert.ok(readFileSync(path.join(output, `${href}.html`), 'utf8'), `Homepage: missing article ${href}`);
}

const treeFrontmatter = readFileSync('posts/leetcode-tree-visualizer.mdx', 'utf8').split('\n---')[0];
const treeImage = treeFrontmatter.match(/^image: (.+)$/m)?.[1];
const treeCardImage = treeFrontmatter.match(/^cardImage: (.+)$/m)?.[1];
assert.ok(treeImage && treeCardImage && treeImage !== treeCardImage, 'Tree visualizer: expected separate cover and thumbnail.');
for (const file of ['posts.html', 'tags/leetcode.html']) {
    const html = readFileSync(path.join(output, file), 'utf8');
    assert.ok([...html.matchAll(/<img\b[^>]*src="([^"]+)"/g)].some(([, src]) => src === treeCardImage), `${file}: dedicated card image must be used.`);
}
const treePost = readFileSync(path.join(output, 'posts/leetcode-tree-visualizer.html'), 'utf8');
assert.ok([...treePost.matchAll(/<img\b[^>]*src="([^"]+)"/g)].some(([, src]) => src === treeImage), 'Tree visualizer: main cover must appear in the article.');
for (const name of ['og:image', 'twitter:image']) {
    const image = treePost.match(new RegExp(`<meta (?:property|name)="${name}" content="([^"]+)"`))?.[1];
    assert.equal(image, new URL(treeImage, 'https://solomk.in').href, `Tree visualizer: ${name} must keep the main image.`);
}

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

const projectTitles = new Set();
const projectDescriptions = new Set();
for (const route of ['/projects/polidict', '/projects/hotkys', '/apps/medical-codes', '/projects/leetcode-tree-visualizer']) {
    assert.ok(home.includes(`href="${route}"`), `Homepage: missing project description link ${route}`);
    assert.ok(sitemap.includes(`<loc>https://solomk.in${route}</loc>`), `Sitemap: missing project ${route}`);
    const html = readFileSync(path.join(output, `${route}.html`), 'utf8');
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
    assert.ok(title && description, `${route}: missing project metadata`);
    assert.ok(!projectTitles.has(title) && !projectDescriptions.has(description), `${route}: duplicate project metadata`);
    projectTitles.add(title);
    projectDescriptions.add(description);
    assert.ok(html.includes(`property="og:url" content="https://solomk.in${route}"`), `${route}: incorrect sharing URL`);
    const jsonLd = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] ?? 'null');
    assert.equal(jsonLd?.url, `https://solomk.in${route}`, `${route}: incorrect structured data URL`);
    assert.equal(jsonLd?.mainEntity?.['@type'], 'SoftwareApplication', `${route}: missing app structured data`);
    const links = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(match => new URL(match[1], 'https://solomk.in').href);
    assert.ok(links.includes(jsonLd.mainEntity.url), `${route}: missing direct app link`);
}
console.log(`Checked ${pages.length} exported pages: links, assets, anchors, headings, image dimensions, canonical and sharing metadata, manifest and sitemap.`);
