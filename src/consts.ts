export const SITE_TITLE = 'wassy328';
export const SITE_DESCRIPTION = 'Personal portfolio of wassy328 — projects, writing, and links.';
export const SITE_URL = 'https://wassy328.com';
export const AUTHOR_NAME = 'Ryoga Washizawa';
export const GITHUB_URL = 'https://github.com/wassy310';

// SNS accounts surfaced on /contact and /about.
// `handle` is rendered as-is, so keep the leading "@".
export const SOCIAL_LINKS = [
	{
		id: 'x',
		label: 'X',
		handle: '@waaaa5267',
		url: 'https://x.com/waaaa5267',
	},
	{
		id: 'instagram',
		label: 'Instagram',
		handle: '@wassy1313',
		url: 'https://www.instagram.com/wassy1313/',
	},
	{
		id: 'facebook',
		label: 'Facebook',
		handle: '@wassy13',
		url: 'https://www.facebook.com/wassy13',
	},
	{
		id: 'github',
		label: 'GitHub',
		handle: '@wassy310',
		url: GITHUB_URL,
	},
] as const;

export type SocialLink = (typeof SOCIAL_LINKS)[number];

// お問い合わせフォーム。Google Forms を作成したら URL を入れると
// /contact の "Coming soon" が自動でボタンに切り替わる。
export const CONTACT_FORM_URL: string | null = null;

// 連絡先メールアドレス。設定すると /contact に Email セクションが表示され、
// null の間はセクションごと非表示（実在アドレスはこのリポジトリでは既定で持たない）。
// 例: export const CONTACT_EMAIL: string | null = 'hello@example.com';
export const CONTACT_EMAIL: string | null = null;

// Google Analytics 4 measurement ID. Only sent from the production domain
// (see BaseHead.astro) so localhost and preview deploys are excluded.
export const GA_MEASUREMENT_ID = 'G-B7MLVE2SDX';

// /projects の「Client Work」タブに出す案件一覧。
// 守秘前提のため詳細ページは作らず、ここのデータをリスト表示するだけ。
export const CLIENT_WORKS = [
	{
		title: '介護施設向け食事自動記録アプリ',
		platform: 'iOS モバイルアプリ（iPhone / iPad 対応）',
		role: 'フロントエンド開発・保守',
		tech: ['Flutter'],
	},
	{
		title: '建築業 ビジネスマッチングサービス',
		platform: 'Web アプリ',
		role: '設計・開発・保守',
		tech: ['Next.js', 'TypeScript', 'Firebase'],
	},
	{
		title: '視線入力式の意思伝達装置・アプリ',
		platform: '組み込みシステム',
		role: '設計・組み込み開発',
		tech: ['Python', 'C#'],
	},
	{
		title: '旅行者向け地域体験マッチングアプリ',
		platform: 'iOS モバイルアプリ',
		role: 'フロントエンド開発',
		tech: ['Flutter'],
	},
] as const;

export type ClientWork = (typeof CLIENT_WORKS)[number];

export const BLOG_CATEGORIES = [
	{ slug: 'tech', label: 'Tech' },
	{ slug: 'travel', label: 'Travel' },
	{ slug: 'essay', label: 'Essay' },
	{ slug: 'event', label: 'Event' },
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number]['slug'];
