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

export const printDiff = (key, data, it, s = ' ') => {
  if (_.isObject(data[key])) {
    process.stdout.write(`${indent(it, 2)}${s} ${key}: `);
    genDiff(data[key], data[key], it + 1);
  } else {
    process.stdout.write(`${indent(it, 2)}${s} ${key}: ${data[key]}\n`);
  }
};

// export const genDiff = (data1, data2, it = 1) => {
//   const keys1 = Object.keys(data1);
//   const keys2 = Object.keys(data2);
//   const mergedKeys = mergeKeys(keys1, keys2);
//   process.stdout.write('{\n');
//   mergedKeys.forEach((key) => {
//     if (keys1.includes(key) && keys2.includes(key)) {
//       if (_.isObject(data1[key]) && _.isObject(data2[key])) {
//         process.stdout.write(`${indent(it, 2)}  ${key}: `);
//         genDiff(data1[key], data2[key], it + 1);
//       } else if (data1[key] === data2[key]) {
//         process.stdout.write(`${indent(it, 2)}  ${key}: ${data1[key]}\n`);
//       } else {
//         printDiff(key, data1, it, '-');
//         printDiff(key, data2, it, '+');
//       }
//     } else if (keys1.includes(key)) {
//       printDiff(key, data1, it, '-');
//     } else if (keys2.includes(key)) {
//       printDiff(key, data2, it, '+');
//     }
//   });
//   process.stdout.write(`${indent(it - 1)}}\n`);
// };

function isObject(value) {
  return value !== null && typeof value === 'object';
}

function computeDifferences(obj1, obj2) {
  const differences = {
      added: {},
      removed: {},
      changed: {}
  };

  // Проверка добавленных и измененных свойств
  for (const key in obj2) {
      if (!(key in obj1)) {
          differences.added[key] = obj2[key]; // Свойство добавлено
      } else if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
          if (isObject(obj1[key]) && isObject(obj2[key])) {
              // Рекурсивное сравнение вложенных объектов
              const nestedDiff = computeDifferences(obj1[key], obj2[key]);
              if (Object.keys(nestedDiff.added).length || Object.keys(nestedDiff.removed).length || Object.keys(nestedDiff.changed).length) {
                  differences.changed[key] = nestedDiff; // Свойство изменено с вложенными различиями
              }
          } else {
              // Если это не объект, записываем измененное значение
              differences.changed[key] = { oldValue: obj1[key], newValue: obj2[key] };
          }
      }
  // Проверка удаленных свойств
    for (const key in obj1) {
        if (!(key in obj2)) {
            differences.removed[key] = obj1[key]; // Свойство удалено
        }
    }
  }
  return differences;
}

const objA = {
  a: 1,
  b: {
      x: 10,
      y: 20
  },
  c: 3
};

const objB = {
  b: {
      x: 10,
      z: 30
  },
  c: 4,
  d: 5
};

const result = computeDifferences(objA, objB);
console.log(result.changed);
