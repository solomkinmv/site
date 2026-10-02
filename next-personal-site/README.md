# Maksym Solomkin's website

Next.js App Router site with MDX posts, a LeetCode tree visualizer, and a Medical Codes app page. GitHub Pages hosts the static export at [solomk.in](https://solomk.in).

Use Node.js 24.11 or newer. Run commands from `next-personal-site`:

```sh
npm ci
npm run dev
```

Development runs at http://localhost:3000. Before shipping:

```sh
npm run lint
npm test
npm run build
npm run check:export
npm audit
```

`npm run build` checks TypeScript and writes the deployable site to `out/`. `check:export` checks local links, assets, heading anchors, image dimensions, canonical and sharing metadata, the sitemap, and manifest icons across every exported page. Preview the export with a static file server, for example `npx serve out`. This project uses `output: "export"`; a Next.js production server is unnecessary.

Posts live in `posts/*.mdx`. Set `draft: true` to exclude a post from the public listing, export, and sitemap. Shared MDX components are in `src/mdx-components.tsx`.

Store article images under `public/images`; Markdown images get measured dimensions at build time. Prefer WebP and native `<video controls preload="none">` for long demos. Keep the original assets when replacing existing public URLs. In blog JSX, use literal attributes such as `width="300"`; `next-mdx-remote` disables JavaScript expressions by default.

Post frontmatter uses `image` for social previews and an optional `cardImage` for listing thumbnails. Thumbnails fall back to `image`; a dedicated `cardImage` fills the thumbnail with a crop. Set `cardImagePosition` (CSS `object-position`, such as `center top`) to adjust that crop. Images inside articles are placed explicitly in Markdown.

The generated blog illustrations use `cover-2026-10-02.webp` (1200 × 630) and `card-2026-10-02.webp` (960 × 720) inside each post's image directory. A cover is placed at the start of the article with `![|no-zoom](...)`; instructional screenshots stay in the body.

UI primitives follow shadcn's `new-york` Tailwind 4 registry. To review upstream changes, run `npx shadcn@latest add button card dropdown-menu input label textarea toggle --dry-run`. Preserve the existing `@/lib/utils` import when updating the registry's `cn` import, and retain the site's theme tokens and custom components.

The Pages workflow installs the lockfile, runs lint, regression tests, the production build and export checks, then deploys pushes to `main`. Dependabot checks npm packages and GitHub Actions weekly.

This README contains current setup and maintenance guidance. Historical audit snapshots live under `docs/audits/` with filenames prefixed by `YYYY-MM-DD`. See the [October 1, 2026 audit](docs/audits/2026-10-01-website-audit.md) for findings and validation from that date. These documentation files are kept in Git and are not part of the deployed static export.
