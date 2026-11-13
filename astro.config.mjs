// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import { visit } from 'unist-util-visit';

const escapeHtml = (s) =>
	s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');

// Transform fenced ```mermaid blocks into <pre class="mermaid-source"> so the
// client-side renderer in BlogPost.astro can swap them for SVG.
function remarkMermaid() {
	return (tree) => {
		visit(tree, 'code', (node, index, parent) => {
			if (node.lang === 'mermaid' && parent && typeof index === 'number') {
				parent.children[index] = {
					type: 'html',
					value: `<pre class="mermaid-source">${escapeHtml(node.value)}</pre>`,
				};
			}
		});
	};
}

const decodeEntities = (s) =>
	s
		.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
		.replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
		.replace(/&quot;/g, '"')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&amp;/g, '&');

const ogpCache = new Map();

// Fetch OGP metadata at build time. Returns null on any failure so the link
// falls back to a plain anchor instead of breaking the build.
async function fetchOgp(url) {
	if (ogpCache.has(url)) return ogpCache.get(url);
	let result = null;
	try {
		const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
		if (res.ok) {
			const html = await res.text();
			const meta = {};
			for (const [tag] of html.matchAll(/<meta\b[^>]*>/gi)) {
				const key = tag.match(/\b(?:property|name)\s*=\s*["']([^"']+)["']/i)?.[1];
				const content = tag.match(/\bcontent\s*=\s*"([^"]*)"|\bcontent\s*=\s*'([^']*)'/i);
				if (key && content) meta[key.toLowerCase()] = decodeEntities(content[1] ?? content[2]);
			}
			const titleTag = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1];
			const title = meta['og:title'] ?? meta['twitter:title'] ?? (titleTag && decodeEntities(titleTag.trim()));
			if (title) {
				const image = meta['og:image'] ?? meta['twitter:image'];
				result = {
					title,
					description: meta['og:description'] ?? meta['twitter:description'] ?? meta['description'],
					image: image && new URL(image, url).href,
					siteName: meta['og:site_name'] ?? new URL(url).hostname,
				};
			}
		}
	} catch (err) {
		console.warn(`[link-card] failed to fetch ${url}:`, err.message);
	}
	ogpCache.set(url, result);
	return result;
}

// Turn a paragraph that contains only a bare URL into a link card, using the
// target page's OGP metadata.
function remarkLinkCard() {
	return async (tree) => {
		const targets = [];
		visit(tree, 'paragraph', (node, index, parent) => {
			if (!parent || typeof index !== 'number' || node.children.length !== 1) return;
			const link = node.children[0];
			if (link.type !== 'link' || !/^https?:\/\//.test(link.url)) return;
			const text = link.children.length === 1 && link.children[0].type === 'text' ? link.children[0].value : '';
			if (text !== link.url) return;
			targets.push({ parent, index, url: link.url });
		});
		await Promise.all(
			targets.map(async ({ parent, index, url }) => {
				const ogp = await fetchOgp(url);
				if (!ogp) return;
				const image = ogp.image
					? `<span class="link-card-image"><img src="${escapeHtml(ogp.image)}" alt="" loading="lazy" decoding="async" /></span>`
					: '';
				const description = ogp.description
					? `<span class="link-card-description">${escapeHtml(ogp.description)}</span>`
					: '';
				parent.children[index] = {
					type: 'html',
					value:
						`<a class="link-card" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">` +
						`<span class="link-card-body">` +
						`<span class="link-card-title">${escapeHtml(ogp.title)}</span>` +
						description +
						`<span class="link-card-site">${escapeHtml(ogp.siteName)}</span>` +
						`</span>${image}</a>`,
				};
			}),
		);
	};
}

// https://astro.build/config
export default defineConfig({
	site: 'https://moai-okinawa.github.io',
	base: '/portfolio-washizawa',
	integrations: [mdx(), sitemap()],
	markdown: {
		remarkPlugins: [remarkMermaid, remarkLinkCard],
	},
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Geist',
			cssVariable: '--font-geist',
			// Intentionally empty: --font-geist expands to its fallbacks *before*
			// var(--font-noto-jp) in global.css, and any generic family (system-ui,
			// sans-serif, …) resolves Japanese glyphs to the OS font, so Noto Sans JP
			// would never be used. The generic fallbacks live at the end of the
			// font-family stack in global.css instead.
			fallbacks: [],
			weights: [400, 500, 600, 700],
			styles: ['normal'],
			display: 'swap',
		},
		{
			provider: fontProviders.google(),
			name: 'Geist Mono',
			cssVariable: '--font-geist-mono',
			fallbacks: ['ui-monospace', 'monospace'],
			weights: [400, 500],
			styles: ['normal'],
			display: 'swap',
		},
		{
			provider: fontProviders.google(),
			name: 'Noto Sans JP',
			cssVariable: '--font-noto-jp',
			fallbacks: ['Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Meiryo', 'sans-serif'],
			weights: [400, 500, 700],
			styles: ['normal'],
			display: 'swap',
		},
	],
});
