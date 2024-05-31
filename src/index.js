import * as fs from 'node:fs';

export const parseData = (path) => JSON.parse(fs.readFileSync(path, 'utf-8'));

const mergeKeys = (result, obj1, obj2, key) => {
  const newResult = { ...result };
  if (Object.hasOwn(obj1, key) && Object.hasOwn(obj2, key)) {
    if (obj1[key] === obj2[key]) {
      newResult[key] = obj1[key];
    } else {
      newResult[key] = [obj1[key], obj2[key]];
    }
  } else if (Object.hasOwn(obj1, key)) {
    newResult[key] = obj1[key];
  } else if (Object.hasOwn(obj2, key)) {
    newResult[key] = obj2[key];
  }
  return newResult;
};

export const mergeObjects = (obj1, obj2) => {
  let result = {};

  const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

  keys.forEach((key) => {
    result = mergeKeys(result, obj1, obj2, key);
  });

  return result;
};

export const genDiff = (data1, data2) => {
  const mergedData = mergeObjects(data1, data2);
  const sortedKeys = Object.keys(mergedData).sort();
  let result = '{\n';
  sortedKeys.forEach((key) => {
    if (Array.isArray(mergedData[key])) {
      result += `  - ${key}: ${mergedData[key][0]}\n`;
      result += `  + ${key}: ${mergedData[key][1]}\n`;
    } else if (Object.hasOwn(data1, key) && Object.hasOwn(data2, key)) {
      result += `    ${key}: ${mergedData[key]}\n`;
    } else if (Object.hasOwn(data1, key)) {
      result += `  - ${key}: ${mergedData[key]}\n`;
    } else {
      result += `  + ${key}: ${mergedData[key]}\n`;
    }
  });
  result += '}';
  return result;
};
