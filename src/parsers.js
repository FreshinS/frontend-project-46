import * as fs from 'node:fs';
import * as yaml from 'js-yaml';

export const checkExt = (path) => {
  if (path.endsWith('.json')) return 'json';
  if (path.endsWith('.yaml')) return 'yaml';
  if (path.endsWith('.yml')) return 'yaml';
};

export const parseData = (path) => {
  if (checkExt(path) === 'json') {
    return JSON.parse(fs.readFileSync(path, 'utf-8'));
  }
  if (checkExt(path) === 'yaml') {
    return yaml.load(fs.readFileSync(path, 'utf-8'));
  }
};
