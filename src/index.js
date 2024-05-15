import * as fs from 'node:fs';

export const parseData = (path) => JSON.parse(fs.readFileSync(path, 'utf-8'));

export const mergeObjects = (obj1, obj2) => {
  const result = {};
  // eslint-disable-next-line
  for (const key in obj1) {
    if (Object.hasOwn(obj1, key)) {
      if (Object.hasOwn(obj2, key)) {
        if (obj1[key] === obj2[key]) {
          result[key] = obj1[key];
        } else {
          result[key] = [obj1[key], obj2[key]];
        }
      } else {
        result[key] = obj1[key];
      }
    }
  }
  // eslint-disable-next-line
  for (const key in obj2) {
    if (Object.hasOwn(obj2, key) && !Object.hasOwn(result, key)) {
      result[key] = obj2[key];
    }
  }
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
