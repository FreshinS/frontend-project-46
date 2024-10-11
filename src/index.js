import _ from 'lodash';
import { parseData } from './parsers.js';
import { stylish } from '../formatters/stylish.js';
import { plain } from '../formatters/plain.js';
import json from '../formatters/json.js';
import { mergeKeys } from './utils.js';

export const createDiff = (data1, data2) => {
  const diff = {
    added: {},
    removed: {},
    common: {},
  };
  const keys1 = Object.keys(data1);
  const keys2 = Object.keys(data2);
  const mergedKeys = mergeKeys(keys1, keys2);
  mergedKeys.forEach((key) => {
    if (keys1.includes(key) && keys2.includes(key)) {
      if (_.isObject(data1[key]) && _.isObject(data2[key])) {
        diff.common[key] = createDiff(data1[key], data2[key]);
      } else if (data1[key] === data2[key]) {
        diff.common[key] = data1[key];
      } else {
        diff.removed[key] = data1[key];
        diff.added[key] = data2[key];
      }
    } else if (keys1.includes(key)) {
      diff.removed[key] = data1[key];
    } else if (keys2.includes(key)) {
      diff.added[key] = data2[key];
    }
  });
  return diff;
};

export const printDiff = (data1, data2, formatter) => {
  const diff = createDiff(data1, data2);
  switch (formatter) {
    case 'json':
      json(diff);
      break;
    case 'plain':
      plain(diff);
      break;
    default:
      stylish(diff);
      break;
  }
};

export const genDiff = (filepath1, filepath2, formatter) => {
  const data1 = parseData(filepath1);
  const data2 = parseData(filepath2);
  if (data1 === null || data2 === null) {
    console.log('wrong extension of files');
    return false;
  }
  printDiff(data1, data2, formatter);
  return true;
};
