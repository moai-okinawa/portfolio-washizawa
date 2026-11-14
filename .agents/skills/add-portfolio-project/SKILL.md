---
name: add-portfolio-project
description: Add one work to the moai-okinawa/portfolio-washizawa portfolio. Use when asked to add a project or work entry to this repository's Projects page, including committing and pushing it.
---

# Add one portfolio project

This skill is for `moai-okinawa/portfolio-washizawa`. Its Projects page reads `src/content/projects/*.md` through the `projects` collection in `src/content.config.ts`. `main` is deployed to GitHub Pages by GitHub Actions.

1. Before editing, ask the user for **作品名・説明・URL** in one message and wait for their reply. Also ask for the project's start date (`YYYY-MM-DD`), because the schema requires `startDate` and the list sorts by it. If the user does not know the start date, ask whether to use the date the entry is added; do not present that date as the real project start without their agreement. Do not invent missing facts.
2. Read `src/content.config.ts` and a few current files in `src/content/projects/` to match the current schema and writing style. Check whether the work already has an entry. Use a unique lowercase kebab-case filename. Create one Markdown file with the provided title, description, date and URL. Use `url:` for a site or product URL; use `repo:` for a public source repository URL. A private repository URL must not become a `repo:` field without the user's explicit direction. Keep the body short and based only on supplied information; use the description as the body when no additional details were provided. Let schema defaults supply optional fields rather than guessing tags, status or images.
3. Work in a checkout whose `origin` is `https://github.com/moai-okinawa/portfolio-washizawa.git`. If the current directory has a different Git history or remote, use a clean clone of this repository for Git operations; do not replace the current directory's `.git` or push to another repository. Keep the new Markdown file in the current working directory too when it is a separate copy of this site.
4. Run `npm run build` (install locked dependencies with `npm ci` if needed) and check that the new project route is generated. Fix only issues caused by the new entry. Review the diff and stage only the new project file. Commit with an English message such as `Add project: <title>`, then push to this repository's `main`. If the remote has changed, integrate its latest state before pushing; never force-push for this workflow.
5. Confirm the pushed commit and report the project page URL in the form `https://moai-okinawa.github.io/portfolio-washizawa/projects/<slug>/`. If the build or push fails, report the exact blocker and do not claim the work is published.

The user's request to run this skill authorizes the project entry, commit and push after the required details are supplied. Ask before making any other content or repository changes.
