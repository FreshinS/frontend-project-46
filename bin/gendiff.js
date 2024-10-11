#!/usr/bin/env node
import { Command } from 'commander';
import { genDiff } from '../src/index.js';

const program = new Command();

program
  .argument('<filepath1>')
  .argument('<filepath2>')
  .description('Compares two configuration files and shows a difference.')
  .version('0.0.1', '-v, --version', 'output the version number')
  .option('-f, --format [type]', 'output format')
  .action((filepath1, filepath2, options) => {
    genDiff(filepath1, filepath2, options.format);
  });

program.parse();
