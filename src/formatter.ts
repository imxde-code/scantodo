import chalk from 'chalk';
import Table from 'cli-table3';
import { TodoMatch, OutputFormat, TodoType } from './types';

const TYPE_COLOR: Record<TodoType, chalk.Chalk> = {
  TODO: chalk.cyan,
  FIXME: chalk.red,
  HACK: chalk.yellow,
  NOTE: chalk.green,
  XXX: chalk.magenta,
};

export function format(matches: TodoMatch[], outputFormat: OutputFormat): string {
  switch (outputFormat) {
    case 'json':
      return JSON.stringify(matches, null, 2);
    case 'markdown':
      return formatMarkdown(matches);
    default:
      return formatTable(matches);
  }
}

export function groupByFile(matches: TodoMatch[]): Map<string, TodoMatch[]> {
  const map = new Map<string, TodoMatch[]>();
  for (const m of matches) {
    const group = map.get(m.file) ?? [];
    group.push(m);
    map.set(m.file, group);
  }
  return map;
}

function formatTable(matches: TodoMatch[]): string {
  if (matches.length === 0) {
    return chalk.green('\n  ✓ Clean! No TODO comments found.\n');
  }

  const counts = matches.reduce<Partial<Record<TodoType, number>>>((acc, m) => {
    acc[m.type] = (acc[m.type] ?? 0) + 1;
    return acc;
  }, {});

  const summary = Object.entries(counts)
    .map(([type, count]) => TYPE_COLOR[type as TodoType](`${type}: ${count}`))
    .join('  ');

  const table = new Table({
    head: ['Type', 'File', 'Line', 'Comment'].map((h) => chalk.bold.white(h)),
    colWidths: [8, 38, 6, 52],
    wordWrap: true,
    style: { head: [], border: ['grey'] },
  });

  for (const m of matches) {
    const color = TYPE_COLOR[m.type];
    const comment = m.author ? `${chalk.dim(`(${m.author})`)} ${m.comment}` : m.comment;
    table.push([color(m.type), chalk.dim(m.file), String(m.line), comment]);
  }

  const header = chalk.bold(`\n  Found ${matches.length} item${matches.length === 1 ? '' : 's'}  `) + summary;
  return `${header}\n\n${table.toString()}\n`;
}

function formatMarkdown(matches: TodoMatch[]): string {
  if (matches.length === 0) return '> ✓ No TODO comments found.';

  const lines = [
    '# TODO Report',
    '',
    `> **${matches.length}** item${matches.length === 1 ? '' : 's'} found`,
    '',
    '| Type | File | Line | Comment |',
    '|------|------|-----:|---------|',
  ];

  for (const m of matches) {
    const comment = m.author ? `*(${m.author})* ${m.comment}` : m.comment;
    lines.push(`| \`${m.type}\` | \`${m.file}\` | ${m.line} | ${comment} |`);
  }

  return lines.join('\n');
}
