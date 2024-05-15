import * as fs from 'node:fs';

export const parseData = (path) => JSON.parse(fs.readFileSync(path, 'utf-8'));

export const genDiff = (data1, data2) => {
    const result = {};
    
}