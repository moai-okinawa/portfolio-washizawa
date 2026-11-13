import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const base = '/portfolio-washizawa/';
const root = new URL('../dist/', import.meta.url).pathname;

async function rewrite(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await rewrite(path);
    } else if (entry.name.endsWith('.html')) {
      const original = await readFile(path, 'utf8');
      const updated = original.replace(
        /(href|src|poster|action)="\/(?!portfolio-washizawa\/)/g,
        `$1="${base}`,
      );
      if (updated !== original) await writeFile(path, updated);
    }
  }
}

await rewrite(root);
