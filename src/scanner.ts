import * as fs from 'fs';
import * as path from 'path';
import { TodoMatch, ScanOptions, TodoType } from './types';

const TODO_REGEX = /^\s*(?:\/\/|#|\/\*|<!--)\s*(TODO|FIXME|HACK|NOTE|XXX)(?:\(([^)]+)\))?:?\s*(.+)/i;

function* walkDir(dir: string, ignore: string[]): Generator<string> {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (ignore.some((i) => entry.name === i)) continue;

    if (entry.isDirectory()) {
      yield* walkDir(fullPath, ignore);
    } else if (entry.isFile()) {
      yield fullPath;
    }
  }
}

const SUPPORTED_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
  '.py', '.go', '.rs', '.java', '.cs', '.cpp', '.c', '.h',
  '.rb', '.php', '.swift', '.kt', '.vue', '.svelte',
]);

export function scan(targetDir: string, options: ScanOptions): TodoMatch[] {
  const results: TodoMatch[] = [];
  const absTarget = path.resolve(targetDir);

  for (const filePath of walkDir(absTarget, options.ignore)) {
    if (!SUPPORTED_EXTENSIONS.has(path.extname(filePath))) continue;

    let content: string;
    try {
      content = fs.readFileSync(filePath, 'utf-8');
    } catch {
      continue;
    }

    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const match = lines[i].match(TODO_REGEX);
      if (!match) continue;

      const type = match[1].toUpperCase() as TodoType;
      if (!options.types.includes(type)) continue;

      results.push({
        file: path.relative(process.cwd(), filePath),
        line: i + 1,
        type,
        author: match[2]?.trim(),
        comment: match[3].trim(),
      });
    }
  }

  return results;
}
