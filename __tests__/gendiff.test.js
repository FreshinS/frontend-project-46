// @ts-check

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseData, mergeObjects, genDiff, checkExt } from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('checExt test', () => {
  const jsonFilePath1 = path.resolve(__dirname, '../__fixtures__/file1.json');
  const jsonFilePath2 = path.resolve(__dirname, '../__fixtures__/file2.json');

  test('check json ext', () => {
    expect(checkExt(jsonFilePath1)).toEqual('json');
    expect(checkExt(jsonFilePath2)).toEqual('json');
  })
    

  const yamlFilePath1 = path.resolve(__dirname, '../__fixtures__/file1.yaml');
  const yamlFilePath2 = path.resolve(__dirname, '../__fixtures__/file2.yaml');

  test('check yaml ext', () => {
    expect(checkExt(yamlFilePath1)).toEqual('yaml');
    expect(checkExt(yamlFilePath2)).toEqual('yaml');
  })
    

  const ymlFilePath1 = path.resolve(__dirname, '../__fixtures__/file1.yml');
  const ymlFilePath2 = path.resolve(__dirname, '../__fixtures__/file2.yml');

  test('check yml ext', () => {
    expect(checkExt(ymlFilePath1)).toEqual('yaml');
    expect(checkExt(ymlFilePath2)).toEqual('yaml');
  })
    
});

describe('JSON comparison functions', () => {
  const filePath1 = path.resolve(__dirname, '../__fixtures__/file1.json');
  const filePath2 = path.resolve(__dirname, '../__fixtures__/file2.json');

  let data1; let
    data2;

  beforeAll(() => {
    data1 = JSON.parse(fs.readFileSync(filePath1, 'utf-8'));
    data2 = JSON.parse(fs.readFileSync(filePath2, 'utf-8'));
  });

  test('parseData', () => {
    expect(parseData(filePath1)).toEqual(data1);
    expect(parseData(filePath2)).toEqual(data2);
  });

  test('mergeObjects', () => {
    const expectedMergeResult = {
      host: 'hexlet.io',
      timeout: [50, 20],
      proxy: '123.234.53.22',
      verbose: true,
      follow: false,
    };
    expect(mergeObjects(data1, data2)).toEqual(expectedMergeResult);
  });

  test('genDiff', () => {
    const expectedDiff = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;
    expect(genDiff(data1, data2)).toBe(expectedDiff);
  });
});
