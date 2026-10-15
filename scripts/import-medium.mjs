#!/usr/bin/env node
// Import Medium articles into src/content/posts/<slug>/index.md.
//
//   npm run import:medium -- @your-handle                 # latest posts from your Medium RSS feed
//   npm run import:medium -- @your-handle --only <url> [<url> ...]   # just these articles
//   npm run import:medium -- ./medium-export/posts        # every post in a Medium data export
//   npm run import:medium -- ./feed.xml                   # a saved copy of the RSS feed
//
// Medium's RSS feed only carries your ~10 most recent posts. For older ones, download your data
// (Medium > Settings > Security and apps > Download your information), unzip it and point this
// script at the posts/ folder.
//
// Each post keeps its original date, gets `canonicalURL` set to the Medium original (so search
// engines don't treat the copy as duplicate content) and has its images downloaded next to it.
// Existing post folders are skipped unless you pass --force. Pass --remote-images to leave images
// on Medium's CDN.

import fs from 'node:fs/promises';
import path from 'node:path';
import TurndownService from 'turndown';

const POSTS_DIR = path.resolve('src/content/posts');

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--') && a !== '--only'));
const onlyIdx = args.indexOf('--only');
const only = onlyIdx >= 0 ? args.slice(onlyIdx + 1).filter((a) => !a.startsWith('--')) : [];
const source = args.find((a, i) => !a.startsWith('--') && (onlyIdx < 0 || i < onlyIdx));

if (!source) {
	console.error('Usage: npm run import:medium -- <@handle | profile URL | export posts folder> [--only <url>...] [--force] [--remote-images]');
	process.exit(1);
}

// ---------- helpers ----------

const decode = (s = '') =>
	s
		.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;|&#x27;/g, "'")
		.trim();

const tag = (xml, name) => decode(xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`))?.[1]);
const tags = (xml, name) => [...xml.matchAll(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, 'g'))].map((m) => decode(m[1]));

// Medium post ids are the trailing 10-12 hex chars of the URL slug.
const mediumId = (url = '') => url.split('?')[0].match(/([0-9a-f]{10,12})\/?$/)?.[1];

const slugify = (s) =>
	s
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/['\u2019]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '')
		.slice(0, 80)
		.replace(/-$/, '');

const stripTags = (html) => decode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

const yamlString = (s) => JSON.stringify(s ?? '');

const exists = (p) => fs.access(p).then(() => true, () => false);

// ---------- HTML -> Markdown ----------

const turndown = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced', bulletListMarker: '-' });

turndown.addRule('figure', {
	filter: 'figure',
	replacement: (_content, node) => {
		const iframe = node.querySelector('iframe');
		if (iframe) return `\n\n${iframe.outerHTML}\n\n`;
		const img = node.querySelector('img');
		if (!img) return _content;
		const caption = node.querySelector('figcaption')?.textContent?.trim();
		const alt = (img.getAttribute('alt') || caption || '').replace(/[\[\]]/g, '');
		return `\n\n![${alt}](${img.getAttribute('src')})${caption ? `\n*${caption}*` : ''}\n\n`;
	},
});
turndown.addRule('iframe', { filter: 'iframe', replacement: (_c, node) => `\n\n${node.outerHTML}\n\n` });
// Medium wraps code in <pre> without <code>.
turndown.addRule('pre', {
	filter: (node) => node.nodeName === 'PRE' && !node.querySelector('code'),
	replacement: (_c, node) => `\n\n\`\`\`\n${node.textContent.replace(/\n$/, '')}\n\`\`\`\n\n`,
});

const cleanHtml = (html) =>
	html
		// Medium separates code lines with <br> inside <pre>
		.replace(/<pre([^>]*)>([\s\S]*?)<\/pre>/g, (_m, attrs, code) => `<pre${attrs}>${code.replace(/<br\s*\/?>/g, '\n')}</pre>`)
		// tracking pixel
		.replace(/<img[^>]+medium\.com\/_\/stat[^>]*>/g, '')
		// "was originally published in <publication>" footer on publication feeds
		.replace(/<hr\s*\/?>\s*<p>\s*<a[^>]*>[\s\S]*?<\/a>\s*was originally published in[\s\S]*?<\/p>\s*$/i, '')
		// export files repeat the title and subtitle at the top of the body
		.replace(/<h3[^>]*class="[^"]*graf--title[^"]*"[^>]*>[\s\S]*?<\/h3>/, '')
		.replace(/<h4[^>]*class="[^"]*graf--subtitle[^"]*"[^>]*>[\s\S]*?<\/h4>/, '');

// ---------- images ----------

async function localiseImages(markdown, dir) {
	const urls = [...new Set([...markdown.matchAll(/!\[[^\]]*\]\((https?:[^)\s]+)\)/g)].map((m) => m[1]))];
	let n = 0;
	for (const url of urls) {
		try {
			const res = await fetch(url);
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const type = res.headers.get('content-type') || '';
			const ext = type.includes('png') ? 'png' : type.includes('gif') ? 'gif' : type.includes('webp') ? 'webp' : type.includes('svg') ? 'svg' : 'jpg';
			const file = `image-${++n}.${ext}`;
			await fs.writeFile(path.join(dir, file), Buffer.from(await res.arrayBuffer()));
			markdown = markdown.split(`(${url})`).join(`(./${file})`);
		} catch (err) {
			console.warn(`    could not download ${url} (${err.message}), keeping the remote link`);
		}
	}
	return markdown;
}

// ---------- sources ----------

async function fromFeed(input) {
	if (input.endsWith('.xml')) return parseFeed(await fs.readFile(input, 'utf8'));
	const handle = input.replace(/^https?:\/\/(www\.)?medium\.com\//, '').replace(/\/$/, '');
	const user = input.match(/^https?:\/\/([^.]+)\.medium\.com/)?.[1];
	const feedUrl = user ? `https://medium.com/feed/@${user}` : `https://medium.com/feed/${handle.startsWith('@') ? handle : '@' + handle}`;
	console.log(`Fetching ${feedUrl}`);
	const res = await fetch(feedUrl, { headers: { 'user-agent': 'agriengg-blog-importer' } });
	if (!res.ok) throw new Error(`Feed request failed: HTTP ${res.status}`);
	return parseFeed(await res.text());
}

function parseFeed(xml) {
	return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item]) => {
		const link = tag(item, 'link').split('?')[0];
		return {
			title: tag(item, 'title'),
			url: link,
			date: new Date(tag(item, 'pubDate')),
			updated: tag(item, 'atom:updated') ? new Date(tag(item, 'atom:updated')) : undefined,
			author: tag(item, 'dc:creator'),
			tags: tags(item, 'category'),
			subtitle: '',
			html: tag(item, 'content:encoded'),
		};
	});
}

async function fromExport(dir) {
	const files = (await fs.readdir(dir)).filter((f) => f.endsWith('.html') && !f.startsWith('draft_'));
	const posts = [];
	for (const f of files) {
		const html = await fs.readFile(path.join(dir, f), 'utf8');
		const url = html.match(/<a[^>]+href="([^"]+)"[^>]*class="p-canonical"/)?.[1] || html.match(/class="p-canonical"[^>]+href="([^"]+)"/)?.[1] || '';
		posts.push({
			title: decode(html.match(/<h1 class="p-name">([\s\S]*?)<\/h1>/)?.[1] || f),
			url,
			date: new Date(html.match(/<time class="dt-published" datetime="([^"]+)"/)?.[1] || Date.now()),
			author: stripTags(html.match(/<a[^>]+class="p-author h-card"[^>]*>([\s\S]*?)<\/a>/)?.[1] || ''),
			tags: [],
			subtitle: stripTags(html.match(/<section data-field="subtitle"[^>]*>([\s\S]*?)<\/section>/)?.[1] || ''),
			html: html.match(/<section data-field="body"[^>]*>([\s\S]*)<\/section>\s*<footer/)?.[1] || '',
		});
	}
	return posts;
}

// ---------- main ----------

const isDir = await fs.stat(source).then((s) => s.isDirectory(), () => false);
let posts = isDir ? await fromExport(source) : await fromFeed(source);

if (only.length) {
	const wanted = new Set(only.map(mediumId).filter(Boolean));
	const found = posts.filter((p) => wanted.has(mediumId(p.url)));
	const missing = only.filter((u) => !found.some((p) => mediumId(p.url) === mediumId(u)));
	if (missing.length) {
		console.warn(`\nNot in this source (the RSS feed only has recent posts, so use a Medium export for these):\n  ${missing.join('\n  ')}\n`);
	}
	posts = found;
}

if (!posts.length) {
	console.log('Nothing to import.');
	process.exit(0);
}

await fs.mkdir(POSTS_DIR, { recursive: true });
let written = 0;

for (const post of posts) {
	const slug = slugify(post.title) || mediumId(post.url) || `post-${post.date.valueOf()}`;
	const dir = path.join(POSTS_DIR, slug);
	if ((await exists(dir)) && !flags.has('--force')) {
		console.log(`  skip  ${slug} (already exists, use --force to overwrite)`);
		continue;
	}
	await fs.mkdir(dir, { recursive: true });

	let body = turndown.turndown(cleanHtml(post.html)).replace(/\n{3,}/g, '\n\n').trim();
	// The feed body often starts with the title as a heading; the layout already shows it.
	body = body.replace(new RegExp(`^#{1,4} ${post.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\n+`), '');
	if (!flags.has('--remote-images')) body = await localiseImages(body, dir);

	// Description: the subtitle, or the first paragraph of prose (blockquote markers and emphasis stripped).
	const firstPara =
		body
			.split('\n\n')
			.map((p) => p.trim().replace(/^>\s*/, ''))
			.find((p) => p && !/^(!\[|<|#|```|[-*] |\d+\. )/.test(p) && !/^\*\*[^*]+\*\*$/.test(p)) || '';
	let description = (post.subtitle || firstPara)
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/[*_`]/g, '')
		.replace(/\s+/g, ' ')
		.trim();
	if (description.length > 200) description = description.slice(0, 200).replace(/\s+\S*$/, '') + '…';

	// Hero: an image in the first two blocks of the post (Medium's usual cover position). It's shown
	// above the article, so it and its caption are dropped from the body. Images further down stay inline.
	const blocks = body.split('\n\n');
	const heroIdx = blocks.slice(0, 2).findIndex((b) => /^!\[[^\]]*\]\([^)\s]+\)/.test(b.trim()));
	const hero = heroIdx >= 0 ? blocks[heroIdx].trim().match(/^!\[([^\]]*)\]\(([^)\s]+)\)/) : null;
	if (hero) {
		blocks.splice(heroIdx, 1);
		body = blocks.join('\n\n').trim();
	}

	const front = [
		'---',
		`title: ${yamlString(post.title)}`,
		`description: ${yamlString(description)}`,
		`pubDate: ${post.date.toISOString().slice(0, 10)}`,
		post.updated && post.updated.toISOString().slice(0, 10) !== post.date.toISOString().slice(0, 10)
			? `updatedDate: ${post.updated.toISOString().slice(0, 10)}`
			: null,
		post.author ? `author: ${yamlString(post.author)}` : null,
		`tags: [${post.tags.map((t) => yamlString(t)).join(', ')}]`,
		hero ? `heroImage: ${yamlString(hero[2])}` : null,
		hero ? `heroAlt: ${yamlString(hero[1])}` : null,
		post.url ? `canonicalURL: ${yamlString(post.url)}` : null,
		post.url ? `originalURL: ${yamlString(post.url)}` : null,
		'---',
	]
		.filter(Boolean)
		.join('\n');

	await fs.writeFile(path.join(dir, 'index.md'), `${front}\n\n${body}\n`);
	console.log(`  wrote ${path.relative(process.cwd(), dir)}/index.md`);
	written++;
}

console.log(`\nImported ${written} post${written === 1 ? '' : 's'}. Check them with npm run dev, then add tags and a category where needed.`);
