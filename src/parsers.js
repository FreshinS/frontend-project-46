import * as fs from 'node:fs';
import yaml from 'js-yaml';

export const parseJSONData = (path) => JSON.parse(fs.readFileSync(path, 'utf-8'));

export const parseYAMLData = (path) => yaml.load(fs.readFileSync(path, 'utf-8'));

export const parseData = (path) => {
  if (path.includes('.json')) {
    return parseJSONData(path);
  } if (path.includes('.yml') || path.includes('.yaml')) {
    return parseYAMLData(path);
  }
  return null;
};
