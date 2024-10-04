// @ts-check

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mergeKeys, indent, printDiff, genDiff } from '../src/index.js';
import { jest } from '@jest/globals';

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

describe('genDiff', () => {
  it('работает с пустыми файлами', () => {
    const logSpy = jest.spyOn(process.stdout, 'write').mockImplementation();

    const obj1 = {};
    const obj2 = {};

    genDiff(obj1, obj2);

    expect(logSpy.mock.calls).toEqual([
      ['{\n'],
      ['}\n']
    ]);

    logSpy.mockRestore();
  });
  it('работает с простыми объектами', () => {
    const logSpy = jest.spyOn(process.stdout, 'write').mockImplementation();

    const obj1 = {
      a: 1,
      b: 2,
      c: 3
    };
    const obj2 = {
      a: 1,
      b: 3,
      d: 5
    };

    genDiff(obj1, obj2);

    expect(logSpy.mock.calls).toEqual([
      ['{\n'],
      ['    a: 1\n'],
      ['  - b: 2\n'],
      ['  + b: 3\n'],
      ['  - c: 3\n'],
      ['  + d: 5\n'],
      ['}\n']
    ]);

    logSpy.mockRestore();
  });
  it('работает с вложенными объектами', () => {
    const logSpy = jest.spyOn(process.stdout, 'write').mockImplementation();

    const obj1 = {
      a: 1,
      b: {
        b1: 2,
        b2: {
          b21: {
            b212: 5
          },
          b23: 5
        }
      },
      c: 3
    };
    const obj2 = {
      a: 1,
      b: {
        b1: 1,
        b2: {
          b21: 3,
          b23: 4
        }
      },
      d: {
        d1: 1
      }
    };

    genDiff(obj1, obj2);

    expect(logSpy.mock.calls).toEqual([
      ['{\n'],
      ['    a: 1\n'],
      ['    b: {\n'],
      ['      - b1: 2\n'],
      ['      + b1: 1\n'],
      ['        b2: {\n'],
      ['          - b21: {\n'],
      ['                b212: 5\n'],
      ['            }\n'],
      ['          + b21: 3\n'],
      ['          - b23: 5\n'],
      ['          + b23: 4\n'],
      ['        }\n'],
      ['    }\n'],
      ['  - c: 3\n'],
      ['  + d: {\n'],
      ['      d1: 1\n'],
      ['    }\n'],
      ['}\n']
    ]);

    logSpy.mockRestore();
  });
});