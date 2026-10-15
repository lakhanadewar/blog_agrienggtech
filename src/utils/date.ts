export const formatDate = (date: Date) =>
	date.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });

// Rough reading time at 220 words a minute.
export const readingTime = (body = '') =>
	Math.max(1, Math.round(body.trim().split(/\s+/).length / 220));
