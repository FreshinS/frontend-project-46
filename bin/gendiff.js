#!/usr/bin/env node
import { Command } from 'commander';
import * as path from 'node:path';
import { parseData, genDiff } from '../src/index.js';

const program = new Command();

program
  .argument('<filepath1>')
  .argument('<filepath2>')
  .description('Compares two configuration files and shows a difference.')
  .version('0.0.1', '-v, --version', 'output the version number')
  .option('-f, --format [type]', 'output format')
  .action((filepath1, filepath2) => {
    const absPath1 = path.resolve(filepath1);
    const absPath2 = path.resolve(filepath2);
    const data1 = parseData(absPath1);
    const data2 = parseData(absPath2);
    console.log(genDiff(data1, data2));
  });

program.parse();
