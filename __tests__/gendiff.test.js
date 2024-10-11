// @ts-check

// import { jest } from '@jest/globals';
import { describe } from '@jest/globals';
import { execSync } from 'child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import json from '../src/formatters/json.js';
import {
  mergeKeys, indent, mergeDiffKeys, createDiff,
} from '../src/utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = { encoding: 'utf8', cwd: path.join(__dirname, '..') };
const result1 = execSync(
  'bin/gendiff.js --format stylish __fixtures__/file1.json __fixtures__/file2.json',
  // @ts-ignore
  options,
);

const result2 = execSync(
  'bin/gendiff.js --format plain __fixtures__/file1.json __fixtures__/file2.json',
  // @ts-ignore
  options,
);

const result3 = execSync(
  'bin/gendiff.js --format json __fixtures__/file1.json __fixtures__/file2.json',
  // @ts-ignore
  options,
);

const rows1 = result1.trim().split('\n');
const rows2 = result2.trim().split('\n');
const rows3 = result3.trim().split('\n');

describe('mergeKeys', () => {
  it('совмещает два массива и сортирует их', () => {
    const keys1 = ['a', 'b', 'c'];
    const keys2 = ['b', 'c', 'd', 'e'];
    const result = mergeKeys(keys1, keys2);
    expect(result).toEqual(['a', 'b', 'c', 'd', 'e']);
  });

  it('работает с пустыми массивами', () => {
    expect(mergeKeys([], ['a', 'b'])).toEqual(['a', 'b']);
    expect(mergeKeys(['a', 'b'], [])).toEqual(['a', 'b']);
    expect(mergeKeys([], [])).toEqual([]);
  });

  it('не содержит одинаковых элементов', () => {
    const keys1 = ['a', 'b'];
    const keys2 = ['b', 'c', 'd'];
    const result = mergeKeys(keys1, keys2);
    expect(result).toEqual(['a', 'b', 'c', 'd']);
  });
});

describe('indent', () => {
  it('возвращает правильное количество отступов', () => {
    expect(indent(1)).toBe('    ');
    expect(indent(2)).toBe('        ');
    expect(indent(1, 2)).toBe('  ');
    expect(indent(1, 0, 2)).toBe('  ');
    expect(indent(1, 1, 2)).toBe(' ');
  });

  it('выводит пустую строку при значении сдвига влево больше чем количество оступов', () => {
    expect(indent(1, 10)).toBe('');
  });
});

describe('mergeDiffKeys', () => {
  it('совмещает три ключа объекта и сортирует их', () => {
    const obj = {
      added: {
        a: 1,
        b: 2,
      },
      removed: {
        b: 3,
        c: 4,
      },
      common: {
        d: 5,
      },
    };
    expect(mergeDiffKeys(obj)).toEqual(['a', 'b', 'c', 'd']);
  });
});

describe('createDiff', () => {
  it('вычисляет отличия двух объектов и выводит их в новый объект', () => {
    const obj1 = {
      b: false,
      c: {
        d: 'fff',
        e: {
          f: 4,
          g: null,
        },
      },
      h: '',
    };
    const obj2 = {
      a: 2,
      b: false,
      c: {
        d: 'fff',
        e: {
          f: 2,
        },
      },
      h: 'yay',
    };
    const result = {
      added: {
        a: 2,
        h: 'yay',
      },
      removed: {
        h: '',
      },
      common: {
        b: false,
        c: {
          added: {},
          removed: {},
          common: {
            d: 'fff',
            e: {
              added: {
                f: 2,
              },
              removed: {
                f: 4,
                g: null,
              },
              common: {},
            },
          },
        },
      },
    };
    expect(createDiff(obj1, obj2)).toEqual(result);
  });
});

describe('stylish', () => {
  it('выводит отличия в JSON формате', () => {
    expect(rows1[0]).toStrictEqual('{');
  });
});
