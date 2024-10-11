import _ from 'lodash';
import { mergeDiffKeys, indent } from '../utils.js';

export const printDiff = (key, value, sign, it) => {
  if (_.isObject(value)) {
    const keys = Object.keys(value);
    return `${indent(it, 2)}${sign} ${key}: {\n${
      keys.map((key1) => {
        if (_.isObject(value[key1])) {
          return printDiff(key1, value[key], ' ', it + 1);
        }
        return `${indent(it + 1, 2)}  ${key1}: ${value[key1]}`;
      }).join('')
    }\n${indent(it)}}`;
  }
  return `${indent(it, 2)}${sign} ${key}: ${value}`;
};

export const isDiffObject = (obj) => {
  const keys = Object.keys(obj);
  if (keys.length === 3) {
    if (keys.includes('added') && keys.includes('removed') && keys.includes('common')) {
      return true;
    } return false;
  } return false;
};

export const printObjDeep = (obj, it = 0) => {
  const keys = Object.keys(obj);
  return keys.map((key) => {
    if (_.isObject(obj[key])) {
      return `${indent(it)}${key}: {\n${printObjDeep(obj[key], it + 1)}${indent(it)}}\n`;
    }
    return `${indent(it)}${key}: ${obj[key]}\n`;
  }).join('');
};

const printIfObject = (obj, key, sign, it) => {
  if (_.isObject(obj[key])) {
    console.log(`${indent(it, 2)}${sign} ${key}: {\n${printObjDeep(obj[key], it + 1)}${indent(it)}}`);
  } else {
    console.log(printDiff(key, obj[key], sign, it));
  }
};

export const stylish = (diff, it = 1) => {
  if (it === 1) console.log('{');
  const keys = mergeDiffKeys(diff);
  keys.forEach((key) => {
    if (Object.keys(diff.common).includes(key)) {
      if (_.isObject(diff.common[key])) {
        console.log(printDiff(key, '{', ' ', it));
        stylish(diff.common[key], it + 1);
        console.log(`${indent(it)}}`);
      } else {
        console.log(printDiff(key, diff.common[key], ' ', it));
      }
    }
    if (Object.keys(diff.removed).includes(key)) {
      printIfObject(diff.removed, key, '-', it);
    }
    if (Object.keys(diff.added).includes(key)) {
      printIfObject(diff.added, key, '+', it);
    }
  });
  if (it === 1) console.log('}');
};
