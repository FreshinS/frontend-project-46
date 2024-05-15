import * as fs from 'node:fs';
import _ from "lodash"

export const parseData = (path) => JSON.parse(fs.readFileSync(path, 'utf-8'));

export const mergeObjects = (obj1, obj2) => {
    const result = {};
    for (let key in obj1) {
        if (obj1.hasOwnProperty(key)) {
            if (obj2.hasOwnProperty(key)) {
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
    for (let key in obj2) {
        if (obj2.hasOwnProperty(key) && !result.hasOwnProperty(key)) {
            result[key] = obj2[key];
        }
    }
    return result;
}
export const genDiff = (data1, data2) => {
    const mergedData = mergeObjects(data1, data2);
    const sortedKeys = Object.keys(mergedData).sort();
    console.log('{');
    sortedKeys.forEach(key => {
        if (Array.isArray(mergedData[key])) {
            console.log(`  - ${key}: ${mergedData[key][0]}`);
            console.log(`  + ${key}: ${mergedData[key][1]}`);
        } else if (data1.hasOwnProperty(key) && data2.hasOwnProperty(key)) {
            console.log(`    ${key}: ${mergedData[key]}`);
        } else if (data1.hasOwnProperty(key)) {
            console.log(`  - ${key}: ${mergedData[key]}`);
        } else {
            console.log(`  + ${key}: ${mergedData[key]}`);
        }
    });
    console.log('}');
}