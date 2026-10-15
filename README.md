# agriengg-blog

The agriengg.tech blog, served at **https://blog.agriengg.tech**.

Built with [Astro](https://astro.build) and Tailwind, using the same fonts, colours and header as
`home_agrienggtech` (and the same "agriengg.tech + label" wordmark as `agriengg-docs`). The output
is a static site.

## Local development

```bash
npm install
npm run dev        # http://localhost:4321 (drafts are shown here)
npm run build      # static site in dist/ (drafts are left out)
npm run preview    # serve dist/ locally
```

## Writing a post

Each post is a folder in `src/content/posts/`. The folder name becomes the URL, so
`src/content/posts/drip-irrigation-basics/index.md` is served at `/drip-irrigation-basics/`.
Put images next to `index.md` and link them as `./photo.jpg`; Astro resizes and compresses them.

```yaml
---
title: Drip irrigation basics
description: One or two sentences for the post list, search results and social cards.
pubDate: 2026-10-15
category: Guides            # shown above the title (defaults to "Article")
tags: [irrigation, water]
heroImage: ./cover.jpg      # optional, local file or https URL
heroAlt: Drip lines in a cotton field
draft: true                 # optional, hides the post from the live site
---
```

Use `.mdx` instead of `.md` if a post needs components.

## Moving posts over from Medium

```bash
# Your latest posts (Medium's RSS feed only carries roughly the 10 most recent)
npm run import:medium -- @your-handle

# Just some of them
npm run import:medium -- @your-handle --only https://medium.com/@your-handle/some-post-1a2b3c4d5e6f

# Everything, including older posts: download your data from Medium
# (Settings > Security and apps > Download your information), unzip it, then
npm run import:medium -- ./medium-export/posts
```

The importer writes one folder per post, downloads the images next to it, and keeps the original
publish date. It sets two fields:

- `canonicalURL`: the Medium original. This tells search engines the Medium copy is the primary
  one, so the blog isn't treated as duplicate content. Delete the line on a post if you want the
  blog version to rank instead (and ideally set the canonical link on Medium to point here).
- `originalURL`: shows a "first published on Medium" note at the end of the post.

Medium exports don't include tags, so add `tags` and `category` by hand after importing. Folders
that already exist are skipped unless you pass `--force`.

## Layout

| Path | What it holds |
| --- | --- |
| `astro.config.mjs` | Site URL, integrations |
| `src/consts.ts` | Site title, description, main site link |
| `src/content.config.ts` | Post frontmatter schema |
| `src/content/posts/` | The posts |
| `src/components/Navbar.astro` | Header, same links as the main site |
| `src/layouts/PostLayout.astro` | Article page |
| `src/styles/global.css` | AgriEngg palette and fonts (same as home_agrienggtech) |
| `scripts/import-medium.mjs` | Medium importer |

RSS lives at `/rss.xml` and the sitemap at `/sitemap-index.xml`.

## Deploying on Vercel

1. Push this folder to its own GitHub repo and import it in Vercel. The Astro preset is picked up
   automatically (build `npm run build`, output `dist`).
2. In the Vercel project, add the domain `blog.agriengg.tech`.
3. At your DNS provider, add a `CNAME` record for `blog` pointing at `cname.vercel-dns.com`.
