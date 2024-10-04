import * as fs from 'node:fs';
import _ from 'lodash';

export const parseData = (path) => JSON.parse(fs.readFileSync(path, 'utf-8'));

const comp1 = (obj1, obj2, key) => (obj1[key] === obj2[key] ? obj1[key] : [obj1[key], obj2[key]]);
const comp2 = (hasKeyInObj1, obj1, obj2, key) => (hasKeyInObj1 ? obj1[key] : obj2[key]);

// const mergeKeys = (result, obj1, obj2, key) => {
//   const newResult = { ...result };
//   const hasKeyInObj1 = Object.hasOwn(obj1, key);
//   const hasKeyInObj2 = Object.hasOwn(obj2, key);

//   if (hasKeyInObj1 && hasKeyInObj2) {
//     newResult[key] = comp1(obj1, obj2, key);
//   } else {
//     newResult[key] = comp2(hasKeyInObj1, obj1, obj2, key);
//   }

//   return newResult;
// };

// export const mergeObjects = (obj1, obj2) => {
//   let result = {};

//   const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

//   keys.forEach((key) => {
//     result = mergeKeys(result, obj1, obj2, key);
//   });

//   return result;
// };

// export const genDiff = (data1, data2) => {
//   const mergedData = mergeObjects(data1, data2);
//   const sortedKeys = Object.keys(mergedData).sort();
//   let result = '{\n';
//   sortedKeys.forEach((key) => {
//     if (Array.isArray(mergedData[key])) {
//       result += `  - ${key}: ${mergedData[key][0]}\n`;
//       result += `  + ${key}: ${mergedData[key][1]}\n`;
//     } else if (Object.hasOwn(data1, key) && Object.hasOwn(data2, key)) {
//       result += `    ${key}: ${mergedData[key]}\n`;
//     } else if (Object.hasOwn(data1, key)) {
//       result += `  - ${key}: ${mergedData[key]}\n`;
//     } else {
//       result += `  + ${key}: ${mergedData[key]}\n`;
//     }
//   });
//   result += '}';
//   return result;
// };

const mergeKeys = (keys1, keys2) => {
  const merged = [...new Set([...keys1, ...keys2])];
  return merged.sort();
};

export const genDiff = (data1, data2, it = 0) => {
  const indent = '  '.repeat(it);
  const keys1 = Object.keys(data1);
  const keys2 = Object.keys(data2);
  const mergedKeys = mergeKeys(keys1, keys2)
  process.stdout.write(`{\n`);
  mergedKeys.forEach((key) => {
    if (keys1.includes(key) && keys2.includes(key)) {
      if (_.isObject(data1[key]) && _.isObject(data2[key])) {
        process.stdout.write(`${indent}  ${key}: `);
        genDiff(data1[key], data2[key], it + 1);
      } else if (data1[key] === data2[key]) {
        process.stdout.write(`${indent}  ${key}: ${data1[key]}\n`);
      } else {
        if (_.isObject(data1[key])) {
          process.stdout.write(`${indent}- ${key}: `);
          genDiff(data1[key], data1[key], it + 1);
        } else {
          process.stdout.write(`${indent}- ${key}: ${data1[key]}\n`);
        }
        if (_.isObject(data2[key])) {
          process.stdout.write(`${indent}+ ${key}: `);
          genDiff(data2[key], data2[key], it + 1);
        } else {
          process.stdout.write(`${indent}+ ${key}: ${data2[key]}\n`);
        }
      }
    } else if (keys1.includes(key)) {
      if (_.isObject(data1[key])) {
        process.stdout.write(`${indent}- ${key}: `);
        genDiff(data1[key], data1[key], it + 1);
      } else {
        process.stdout.write(`${indent}- ${key}: ${data1[key]}\n`);
      }
    } else if (keys2.includes(key)) {
      if (_.isObject(data2[key])) {
        process.stdout.write(`${indent}+ ${key}: `);
        genDiff(data2[key], data2[key], it + 1);
      } else {
        process.stdout.write(`${indent}+ ${key}: ${data2[key]}\n`);
      }
    }
  })
  process.stdout.write(`${indent}}\n`);
}