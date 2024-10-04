import _ from 'lodash';

export const mergeKeys = (keys1, keys2) => {
  const merged = [...new Set([...keys1, ...keys2])];
  return merged.sort();
};

export const indent = (it, left = 0, i = 4) => {
  const repeats = it * i - left;
  if (repeats < 0) {
    return '';
  }
  return ' '.repeat(repeats);
};

const logDiff = (key, data, it, s = ' ') => {
  if (_.isObject(data[key])) {
    process.stdout.write(`${indent(it, 2)}${s} ${key}: `);
    genDiff(data[key], data[key], it + 1);
  } else {
    process.stdout.write(`${indent(it, 2)}${s} ${key}: ${data[key]}\n`);
  }
};

export const genDiff = (data1, data2, it = 1) => {
  const keys1 = Object.keys(data1);
  const keys2 = Object.keys(data2);
  const mergedKeys = mergeKeys(keys1, keys2);
  process.stdout.write('{\n');
  mergedKeys.forEach((key) => {
    if (keys1.includes(key) && keys2.includes(key)) {
      if (_.isObject(data1[key]) && _.isObject(data2[key])) {
        process.stdout.write(`${indent(it, 2)}  ${key}: `);
        genDiff(data1[key], data2[key], it + 1);
      } else if (data1[key] === data2[key]) {
        process.stdout.write(`${indent(it, 2)}  ${key}: ${data1[key]}\n`);
      } else {
        logDiff(key, data1, it, '-');
        logDiff(key, data2, it, '+');
      }
    } else if (keys1.includes(key)) {
      logDiff(key, data1, it, '-');
    } else if (keys2.includes(key)) {
      logDiff(key, data2, it, '+');
    }
  });
  process.stdout.write(`${indent(it - 1)}}\n`);
};
