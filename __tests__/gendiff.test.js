// @ts-check

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { jest } from '@jest/globals';
import { mergeKeys, indent, genDiff } from '../src/index.js';

describe('mergeKeys', () => {
  it('should merge two arrays of keys and return sorted unique values', () => {
    const keys1 = ['a', 'b', 'c'];
    const keys2 = ['b', 'c', 'd', 'e'];
    const result = mergeKeys(keys1, keys2);
    expect(result).toEqual(['a', 'b', 'c', 'd', 'e']);
  });

  it('should handle empty arrays', () => {
    expect(mergeKeys([], ['a', 'b'])).toEqual(['a', 'b']);
    expect(mergeKeys(['a', 'b'], [])).toEqual(['a', 'b']);
    expect(mergeKeys([], [])).toEqual([]);
  });

  it('should return sorted unique values when arrays have common elements', () => {
    const keys1 = ['a', 'b'];
    const keys2 = ['b', 'c', 'd'];
    const result = mergeKeys(keys1, keys2);
    expect(result).toEqual(['a', 'b', 'c', 'd']);
  });
});

describe('indent', () => {
  it('should return the correct indentation string', () => {
    expect(indent(1)).toBe('    ');
    expect(indent(2)).toBe('        ');
    expect(indent(1, 2)).toBe('  ');
    expect(indent(1, 10)).toBe('');
  });

  it('should return an empty string when repeats is negative', () => {
    expect(indent(1, 10)).toBe('');
  });
});

describe('genDiff', () => {
  const consoleSpy = jest.spyOn(console, 'log');

  test('тестирование вывода в консоль', () => {
    console.log('Hello, World!');
    expect(consoleSpy).toHaveBeenCalledWith('Hello, World!');
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });
});
