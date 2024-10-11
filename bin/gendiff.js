#!/usr/bin/env node
import { Command } from 'commander';
import * as path from 'node:path';
import { genDiff } from '../src/index.js';
import { parseData } from '../src/parsers.js';
import { stylish } from '../formatters/stylish.js';
import { plain } from '../formatters/plain.js';
import json from '../formatters/json.js';

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
    if (data1 === null || data2 === null) {
      console.log('wrong extension of files');
      return false;
    }
    const diff = genDiff(data1, data2);
    json(diff);
    // stylish(diff);
    //plain(diff);
    return true;
  });

program.parse();
