# portfolio-washizawa

Astro製のポートフォリオサイトです。`main` へのpushでGitHub Actionsがビルドし、GitHub Pagesへ公開します。

公開URL: https://moai-okinawa.github.io/portfolio-washizawa/

## ローカル実行

```sh
npm ci
npm run dev
```

GitHub Pages向けビルドでは `npm run build` の後に `node scripts/prefix-pages-links.mjs` を実行します。
