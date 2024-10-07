import _ from 'lodash';

export const mergeKeys = (keys1, keys2) => {
  const merged = [...new Set([...keys1, ...keys2])];
  return merged.sort();
};

export const genDiff = (data1, data2) => {
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
        diff.common[key] = genDiff(data1[key], data2[key]);
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
