import { Resvg } from '@resvg/resvg-js';
import type { APIRoute, GetStaticPaths } from 'astro';
import { type CollectionEntry, getCollection } from 'astro:content';
import satori from 'satori';
import { AUTHOR_NAME, BLOG_CATEGORIES } from '../../../consts';

// Per-post OG image (1200x630), styled after public/og.png.

const COLORS = {
	background: '#f6f8fa',
	circle: '#e7eff2',
	foreground: '#0f1b1f',
	muted: '#5f6b70',
	primary: '#14a39a',
};

// Google Fonts returns a TTF (which satori needs) for legacy user agents, and
// `text=` subsets it to just the glyphs we draw, keeping the download tiny.
async function loadFont(weight: number, text: string): Promise<ArrayBuffer> {
	const cssURL = `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@${weight}&text=${encodeURIComponent(text)}`;
	const css = await fetch(cssURL, { headers: { 'User-Agent': 'Mozilla/4.0' } }).then((r) => r.text());
	const fontURL = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
	if (!fontURL) throw new Error(`[og] could not resolve Noto Sans JP ${weight}`);
	return fetch(fontURL).then((r) => r.arrayBuffer());
}

const formatDate = (date: Date) =>
	date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

export const getStaticPaths = (async () => {
	const posts = await getCollection('blog');
	return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ post: CollectionEntry<'blog'> }> = async ({ props }) => {
	const { title, pubDate, category } = props.post.data;
	const label = BLOG_CATEGORIES.find((c) => c.slug === category)?.label ?? category;
	const meta = `${label.toUpperCase()} · ${formatDate(pubDate)}`;
	const site = 'wassy328.com';

	const [regular, bold] = await Promise.all([
		loadFont(500, `${meta}${AUTHOR_NAME}${site}`),
		loadFont(700, title),
	]);

	const svg = await satori(
		{
			type: 'div',
			props: {
				style: {
					width: '100%',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					padding: '80px 88px 68px',
					background: COLORS.background,
					fontFamily: 'Noto Sans JP',
					position: 'relative',
				},
				children: [
					{
						type: 'div',
						props: {
							style: {
								position: 'absolute',
								right: -260,
								top: -40,
								width: 760,
								height: 760,
								borderRadius: 9999,
								background: COLORS.circle,
							},
						},
					},
					{
						type: 'div',
						props: {
							style: { display: 'flex', flexDirection: 'column', gap: 28 },
							children: [
								{
									type: 'div',
									props: {
										style: { fontSize: 30, fontWeight: 500, color: COLORS.primary, letterSpacing: 2 },
										children: meta,
									},
								},
								{
									type: 'div',
									props: {
										style: {
											fontSize: title.length > 40 ? 56 : 66,
											fontWeight: 700,
											lineHeight: 1.35,
											color: COLORS.foreground,
											maxWidth: 1000,
											lineClamp: 3,
										},
										children: title,
									},
								},
							],
						},
					},
					{
						type: 'div',
						props: {
							style: {
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'flex-end',
								fontSize: 30,
								fontWeight: 500,
							},
							children: [
								{ type: 'div', props: { style: { color: COLORS.muted }, children: AUTHOR_NAME } },
								{ type: 'div', props: { style: { color: COLORS.primary }, children: site } },
							],
						},
					},
				],
			},
		},
		{
			width: 1200,
			height: 630,
			fonts: [
				{ name: 'Noto Sans JP', data: regular, weight: 500, style: 'normal' },
				{ name: 'Noto Sans JP', data: bold, weight: 700, style: 'normal' },
			],
		},
	);

	const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
	return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
