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

const genDiff = (data1, data2) => {
  const diff = {
    added: {},
    removed: {},
    common: {}
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
}

const objA = {
  "common": {
      "setting1": "Value 1",
      "setting2": 200,
      "setting3": true,
      "setting6": {
          "key": "value",
          "doge": {
              "wow": ""
          }
      }
  },
  "group1": {
      "baz": "bas",
      "foo": "bar",
      "nest": {
          "key": "value"
      }
  },
  "group2": {
      "abc": 12345,
      "deep": {
          "id": 45
      }
  }
}

const objB = {
  "common": {
      "follow": false,
      "setting1": "Value 1",
      "setting3": null,
      "setting4": "blah blah",
      "setting5": {
          "key5": "value5"
      },
      "setting6": {
          "key": "value",
          "ops": "vops",
          "doge": {
              "wow": "so much"
          }
      }
  },
  "group1": {
      "foo": "bar",
      "baz": "bars",
      "nest": "str"
  },
  "group3": {
      "deep": {
          "id": {
              "number": 45
          }
      },
      "fee": 100500
  }
}

console.log(genDiff(objA, objB));