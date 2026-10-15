import { getCollection } from 'astro:content';

export const getPublishedPosts = async () =>
	(await getCollection('posts', ({ data }) => import.meta.env.DEV || !data.draft)).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);

export const tagSlug = (tag: string) =>
	tag.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
