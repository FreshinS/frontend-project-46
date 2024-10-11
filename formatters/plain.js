const complexValue = (value) => {
    if (_.isObject(value)) {
      return `[complex value]`;
    }
    else if (typeof value === 'string') {
      return `'${value}'`
    } else {
      return `${value}`
    }
  }
  
  
  export const plain = (diff, path = '') => {
    const keys = [...new Set([...Object.keys(diff.added), ...Object.keys(diff.removed), ...Object.keys(diff.common)])].sort();
    let removed;
    let added;
    let fullPath;
    keys.forEach((key) => {
      if (Object.keys(diff.added).includes(key) && Object.keys(diff.removed).includes(key)) {
        fullPath = `${path}${path.length === 0 ? '' : '.'}${key}`
        removed = complexValue(diff.removed[key]);
        added = complexValue(diff.added[key]);
        console.log(`Property '${fullPath}' was updated. From ${removed} to ${added}`);
      } else {
        if (Object.keys(diff.common).includes(key)) {
          if (_.isObject(diff.common[key])) {
            plain(diff.common[key], path.length === 0 ? key : `${path}.${key}`);
          }
        }
        if (Object.keys(diff.removed).includes(key)) {
          fullPath = `${path}${path.length === 0 ? '' : '.'}${key}`
          console.log(`Property '${fullPath}' was removed`);
        }
        if (Object.keys(diff.added).includes(key)) {
          fullPath = `${path}${path.length === 0 ? '' : '.'}${key}`
          added = complexValue(diff.added[key]);
          console.log(`Property '${fullPath}' was added with value: ${added}`);
        }
      }
    });
  }