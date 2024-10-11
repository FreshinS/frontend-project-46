export const indent = (it, left = 0, i = 4) => {
  const repeats = it * i - left;
  if (repeats < 0) {
    return '';
  }
  return ' '.repeat(repeats);
};

export const mergeKeys = (keys1, keys2) => {
  const merged = [...new Set([...keys1, ...keys2])];
  return merged.sort();
};

export const mergeDiffKeys = (diff) => {
  const merged = [...new Set(Object.keys({ ...diff.added, ...diff.removed, ...diff.common }))];
  return merged.sort();
};
