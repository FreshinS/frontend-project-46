import { stylish } from './stylish.js';
import { plain } from './plain.js';
import json from './json.js';
import { createDiff } from '../utils.js';

const format = (data1, data2, formatter) => {
  const diff = createDiff(data1, data2);
  switch (formatter) {
    case 'json':
      json(diff);
      break;
    case 'plain':
      plain(diff);
      break;
    default:
      stylish(diff);
      break;
  }
};

export default format;
