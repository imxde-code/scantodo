#!/usr/bin/env node
import { Command } from 'commander';
import { scan } from './scanner';
import { format } from './formatter';
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
  .action((dir: string, options: { format: string; ignore: string[]; types: string[]; fail: boolean }) => {
    const ignore = [...DEFAULT_IGNORE, ...options.ignore];
    const types = options.types.map((t) => t.toUpperCase()) as TodoType[];

    const matches = scan(dir, { ignore, types });
    const output = format(matches, options.format as OutputFormat);

    console.log(output);

    if (options.fail && matches.length > 0) {
      process.exit(1);
    }
  });

program.parse();
