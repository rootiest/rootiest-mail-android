// Rootiest Mail shows its own logo wherever upstream shows Bulwark's: every
// file that loads a Bulwark logo also picks the Rootiest one (lib/rootiest-logo),
// so a screen upstream adds can't bring the Bulwark logo back unnoticed.
import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const SRC = join(__dirname, '..', '..');

function sources(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === '__tests__' ? [] : sources(path);
    return /\.tsx?$/.test(name) ? [path] : [];
  });
}

describe('rootiest logos', () => {
  it('replace every Bulwark logo the app loads', () => {
    const missed = sources(SRC)
      .filter((file) => {
        const text = readFileSync(file, 'utf8');
        return /require\([^)]*assets\/logos\/Bulwark/.test(text) && !text.includes('ROOTIEST_LOGO_');
      })
      .map((file) => relative(SRC, file));
    expect(missed).toEqual([]);
  });
});
