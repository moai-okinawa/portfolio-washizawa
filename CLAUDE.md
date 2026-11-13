# CLAUDE.md

`wassy328.com` のポートフォリオサイト（Astro × Cloudflare Pages）。Claude セッションが立ち上がった際にまず参照する前提のメモ。

## 何を書くサイトか

- 公開ポートフォリオ（認証なし）
- Home / About / Projects / Blog / Contact の5ページ構成（Gallery / Links は削除済み）
- 家族・チーム向けの `wiki.wassy328.com` は別系統で、**この公開サイトからは絶対にリンクしない**

## 技術スタック

- **Framework**: Astro 6（Content Collections: `blog`, `projects`）
- **Hosting**: Cloudflare Pages（`main` push で自動デプロイ）
- **Fonts**: Geist / Geist Mono / Noto Sans JP（Astro Fonts API・Google provider）
- **Design tokens**: Morphos "Abalone" palette（`src/styles/global.css` に `oklch()` で light + dark の2セット）
- **Theme switch**: `src/components/ThemeToggle.astro`（OS preference + `localStorage`、no-flash 用スクリプトは `BaseHead.astro`）

## ブランチ運用

`main` への直接 push は禁止。branch + PR 経由で squash merge。詳細は [README.md#ブランチ運用--pr](README.md#ブランチ運用--pr) を参照。

- ブランチ名プレフィックス：`feat/` `fix/` `refactor/` `chore/` `docs/`
- Commit message・PR title：英語
- PR body：日本語
- **マージは必ずオーナー（wassy328）が手動で実施**。Claude は PR 作成までで止める（`gh pr merge` 系を呼ばない）

## ページ・コンテンツ編集の注意

### About（`src/pages/about.astro`）

`education` / `career` / `skills` は配列で定義。本人情報の出典：

```
/Users/wassy/Library/Mobile Documents/iCloud~md~obsidian/Documents/Note/999_Others/Personal Data.md
```

Skills は「発信向けにインパクトのあるものだけ」を残す方針。Git/GitHub・Linux・JS のような commodity skill は意図的に外している。

### Projects（`src/content/projects/*.md`）

1ファイル1プロジェクト。フロントマターは `src/content.config.ts` の `projects` スキーマ参照。

**Private repo のプロジェクトには `repo:` フィールドを付けない**（クリックできる link は public repo に限定）。

### Contact（`src/pages/contact.astro`）

SNS アカウントと問い合わせ先。アカウント一覧は `src/consts.ts` の `SOCIAL_LINKS`、
フォームは `CONTACT_FORM_URL` で管理する（`null` の間は "Coming soon" 表示、
Google Forms の URL を入れると自動でボタンに切り替わる）。
表示は `src/components/SocialLinks.astro`（`rows` = /contact、`chips` = /about の 07 Contact）。

### Blog

`src/pages/blog/index.astro` は記事0件のとき empty state を出すので、`src/content/blog/` は空でも成立する。

## レイアウト・スタイル方針

エディトリアル系デザイン（参考: shinyaokano.jp のUI/UX を Abalone パレットで再解釈）。

- Header は sticky + `backdrop-filter` で半透明背景。スクロール時のみ下ボーダー表示
- Footer は body の flex column + `main { flex: 1 0 auto }` で短いページでも viewport 下端に固定
- 各ページの `.page-head` は `.eyebrow`（ラベル）+ `.display`（大判 uppercase 見出し）
- 一覧はカードではなく番号付き（`01` `02` …）ヘアライン区切りのエディトリアルリスト
- モーションは2層構成。どちらも `prefers-reduced-motion: reduce` で完全に停止する
  - **Intro**（Home のみ・タブセッションにつき1回）：`src/components/EagleIntro.astro`。鷲のシルエットが横切り、通った跡から画面が現れる。`[data-eagle-reveal]` 内の文字は1文字ずつに分割され、鷲が上を通る時刻に合わせて左から順に現れる。Home の hero には Entrance（`.mask-line` / `.rise-in`）を付けない
  - **Entrance**（ロード時・CSS only・JS 不要）：`.mask-line`（見出しのマスク上げ）/ `.rise-in`（フェードアップ）/ `.rule-draw`。遅延は `style="--delay: 0.18s"` で指定
  - **Reveal**（スクロール時）：`[data-reveal]` + `BaseHead.astro` の IntersectionObserver。`[data-reveal-stagger]` を付けると直下の子要素が順番に出る（`--i` は同スクリプトが付与）
- `.link-more` の下線ワイプは中のテキストを `<span class="label">` で包む前提
- 共通ユーティリティ（`.eyebrow` / `.display` / `.link-more` / reveal）は `global.css` に定義
- カラー・余白は必ず `var(--*)` トークン経由（生 hex を直接書かない）

## デプロイ

- Production: `https://wassy328.com`
- Preview: PR ブランチごとに `<commit>.wassy328.pages.dev` が自動発行
- `wassy310/portfolio` repo は **private**。README で `repo:` 露出しないこと
