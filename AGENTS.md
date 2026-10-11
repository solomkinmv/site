# Personal Site — Repository Guidelines

Maksym Solomkin's website at [solomk.in](https://solomk.in): a Next.js App Router site with MDX posts, project pages, a LeetCode tree visualizer, and a Medical Codes app page. It is built as a static export (`output: "export"`) and hosted on GitHub Pages. See [next-personal-site/README.md](next-personal-site/README.md) for detailed maintenance notes.

## Project map

| Path                                        | Purpose                                                         |
| ------------------------------------------- | --------------------------------------------------------------- |
| `next-personal-site/src/app`                | App Router pages, `sitemap.ts`, `robots.ts`, `manifest.ts`      |
| `next-personal-site/src/components`         | Site components; `ui/` holds shadcn primitives, `blog/` post UI |
| `next-personal-site/src/lib`                | Post loading (`posts.ts`), types, project data (`projects.ts`)  |
| `next-personal-site/src/mdx-components.tsx` | Shared MDX element mappings and components                      |
| `next-personal-site/posts`                  | Blog posts as `<slug>.mdx`                                      |
| `next-personal-site/public/images`          | Article and page images, one directory per post                 |
| `next-personal-site/scripts`                | `check-export.mjs` validates the exported site                  |
| `next-personal-site/tests`                  | `node:test` regression tests                                    |
| `next-personal-site/docs`                   | Blog image style guide and dated audits (not deployed)          |

## Commands

Use Node.js 24.11 or newer and npm. Run everything from `next-personal-site`:

- `npm ci` — install from the lockfile
- `npm run dev` — dev server at http://localhost:3000
- `npm run lint` — ESLint
- `npm test` — regression tests (`node --test tests/*.test.mjs`)
- `npm run build` — `tsc --noEmit`, then `next build` into `out/`
- `npm run check:export` — checks links, assets, anchors, image dimensions, metadata, sitemap and manifest in `out/` (run after `build`)

## Posts and MDX

- Posts are loaded from `posts/*.mdx` by `src/lib/posts.ts` through `next-mdx-remote`; the slug is the file name.
- Frontmatter: `title`, `date` (`YYYY-MM-DD`), `tags` (array), `draft`, `summary`, `description`, `image` (social preview), optional `cardImage` (listing thumbnail, falls back to `image`) and `cardImagePosition` (CSS `object-position`).
- `draft: true` excludes a post from listings, static params, and the sitemap.
- JavaScript expressions are disabled in post MDX; use literal JSX attributes such as `width="300"`.
- The remark/rehype plugin list is duplicated in `next.config.mjs` and `src/lib/posts.ts`; keep both in sync.
- Store images under `public/images/<slug>/`; prefer WebP. Keep originals when replacing existing public URLs.

## Blog imagery

Before generating or replacing blog covers, thumbnails, or sharing images, read and follow [the blog image style](next-personal-site/docs/blog-image-style.md). Use its shared prompt and the appropriate cover or thumbnail framing, unless the user requests a different direction.

## Styling and UI

- Tailwind CSS 4 with theme tokens in `src/app/globals.css`; shadcn `new-york` style, `slate` base color, CSS variables (`components.json`).
- Aliases: `@/components`, `@/components/ui`, `@/lib`, `@/lib/utils` (`cn`), `@/hooks`.
- When updating shadcn primitives, keep the `@/lib/utils` import, the site's theme tokens, and custom components.

## Delivery

- Commit messages use `type(scope): summary`, e.g. `fix(site): ...`, `chore(ui): ...`, `chore(deps): ...`.
- `.github/workflows/deploy-pages.yml` runs on pushes to `main` that touch `next-personal-site/**` (or manually): `npm ci`, lint, test, build, `check:export`, then deploys `next-personal-site/out` to GitHub Pages.
- Dependabot updates npm packages and GitHub Actions weekly.
