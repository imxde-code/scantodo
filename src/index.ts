#!/usr/bin/env node
import chalk from 'chalk';
import { Command } from 'commander';
import { scan } from './scanner';
import { format, groupByFile } from './formatter';
import { OutputFormat, TodoType } from './types';

const DEFAULT_IGNORE = ['node_modules', '.git', 'dist', 'build', 'coverage', '.next', '.nuxt'];
const ALL_TYPES: TodoType[] = ['TODO', 'FIXME', 'HACK', 'NOTE', 'XXX'];

const program = new Command();

program
  .name('scantodo')
  .description('Scan your codebase for TODO, FIXME, HACK, NOTE, and XXX comments')
  .version('1.0.0')
  .argument('[dir]', 'Directory to scan', '.')
  .option('-f, --format <format>', 'Output format: table | json | markdown', 'table')
  .option('-i, --ignore <dirs...>', 'Extra directories to ignore', [])
  .option(
    '-t, --types <types...>',
    'Comment types to include (TODO FIXME HACK NOTE XXX)',
    ALL_TYPES,
  )
  .option('--no-fail', 'Always exit with code 0 even when items are found')
  .option('-g, --group-by-file', 'Group results by file in table output')
  .action((dir: string, options: { format: string; ignore: string[]; types: string[]; fail: boolean; groupByFile: boolean }) => {
    const ignore = [...DEFAULT_IGNORE, ...options.ignore];
    const types = options.types.map((t) => t.toUpperCase()) as TodoType[];

    const matches = scan(dir, { ignore, types });

    if (options.groupByFile && options.format === 'table') {
      const groups = groupByFile(matches);
      for (const [file, items] of groups) {
        console.log(chalk.bold.underline(`\n${file}`));
        console.log(format(items, 'table'));
      }
    } else {
      console.log(format(matches, options.format as OutputFormat));
    }

    if (options.fail && matches.length > 0) {
      process.exit(1);
    }
  });

program.parse();
