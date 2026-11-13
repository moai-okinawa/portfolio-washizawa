---
title: 'Portfolio'
description: 'Astro 6 で構築し、Cloudflare Pages 上で静的配信する個人ポートフォリオ。Content Collections による型付きコンテンツ管理と、main push 起点の CI/CD を採用。'
startDate: 2026-05-17
status: active
url: https://wassy328.com
tags:
  - astro
  - cloudflare-pages
  - typescript
  - content-collections
  - static-site
---

`wassy328.com` の apex に配置する個人ポートフォリオサイト。コンテンツ駆動の静的サイトとして、ビルド時に完結する構成を意図的に選んでいる。

## アーキテクチャ

- Astro 6 のゼロ JS デフォルトを活かし、ページの大半は素の HTML/CSS として出力。JavaScript はテーマ切り替えや図表描画など必要な箇所にのみ限定して配信する。
- Content Collections（`projects` / `blog`）で、フロントマターを Zod スキーマにより型検証。`status` や `tags` などの enum / 配列フィールドをビルド時に静的チェックし、コンテンツ起因の事故を防いでいる。
- MDX を有効化し、Markdown に加えてコンポーネントを埋め込んだ記事も書けるようにしている。
- 記事内の Mermaid フェンスドブロックは、自作の remark プラグインで `<pre class="mermaid-source">` へ変換し、クライアント側で遅延描画。ビルド時に図表ソースを HTML エスケープしてから埋め込むことで、意図しないマークアップ混入を避けている。

## ホスティングと配信

- Cloudflare Pages にデプロイし、`main` への push を起点にビルド〜本番反映まで自動化（CI/CD）。
- Pull Request ごとにプレビュー環境が自動発行されるため、本番へ反映する前に実ブラウザで差分を確認できる。
- 配信物は静的アセットのみで、サーバーサイドの実行環境や永続データストアを持たない。攻撃面を最小化する設計上の選択。

## デザインと表示

- デザイントークンは `oklch()` ベースのパレットを light / dark の2セットで定義し、色・余白はすべて CSS カスタムプロパティ経由で参照。生の色値をコンポーネントに直書きしない方針。
- テーマ切り替えは OS の `prefers-color-scheme` を初期値に、`localStorage` で明示選択を保持。初回描画時のちらつき（FOUC）を防ぐため、`<head>` 内インラインスクリプトで描画前にテーマを確定させている。
- フォントは Astro の Fonts API（Google provider）経由で Geist / Geist Mono / Noto Sans JP を `display: swap` で配信。

## なぜこの構成か

- Markdown ファイルを置くだけで記事が公開される状態にしたかった。レンダリングのための仕組みを別途組む必要がなく、コンテンツの追加・更新も Markdown だけで完結する。
- 個人インフラを寄せている Cloudflare にそのまま載ることを重視した。Astro の静的出力なら OpenNext のような変換層が不要で、デプロイ経路に詰まりどころがない。
- 静的出力に寄せることで、表示速度・可搬性・セキュリティのいずれにも無理がない。
- 型付きコンテンツと自動デプロイにより、書く〜公開するまでの手数を最小化している。
