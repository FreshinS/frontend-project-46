import _ from 'lodash';

export const indent = (it, left = 0, i = 4) => {
  const repeats = it * i - left;
  if (repeats < 0) {
    return '';
  }
  return ' '.repeat(repeats);
};

export const printDiff = (key, value, sign, it) => {
  if (_.isObject(value)) {
    const keys = Object.keys(value);
    let result = `${indent(it, 2)}${sign} ${key}: {\n`;
    keys.forEach((key1) => {
      if (_.isObject(value[key1])) {
        result += printDiff(key1, value[key], ' ', it + 1);
      } else {
        result += `${indent(it + 1, 2)}  ${key1}: ${value[key1]}`;
      }
    });
    result += `\n${indent(it)}}`;
    return result;
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
  let result = '';
  keys.forEach((key) => {
    if (_.isObject(obj[key])) {
      result += `${indent(it)}${key}: {\n${printObjDeep(obj[key], it + 1)}${indent(it)}}`;
    } else {
      result += `${indent(it)}${key}: ${obj[key]}`;
    }
    result += '\n';
  });
  return result;
};

export const stylish = (diff, it = 1) => {
  if (it === 1) console.log('{');
  const keys = [...new Set([...Object.keys(diff.added), ...Object.keys(diff.removed), ...Object.keys(diff.common)])].sort();
  keys.forEach((key) => {
    // console.log('[debug]', key);
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
      if (_.isObject(diff.removed[key])) {
        console.log(`${indent(it, 2)}- ${key}: {\n${printObjDeep(diff.removed[key], it + 1)}${indent(it)}}`);
      } else {
        console.log(printDiff(key, diff.removed[key], '-', it));
      }
    }
    if (Object.keys(diff.added).includes(key)) {
      if (_.isObject(diff.added[key])) {
        console.log(`${indent(it, 2)}+ ${key}: {\n${printObjDeep(diff.added[key], it + 1)}${indent(it)}}`);
      } else {
        console.log(printDiff(key, diff.added[key], '+', it));
      }
    }
  });
  if (it === 1) console.log('}');
};