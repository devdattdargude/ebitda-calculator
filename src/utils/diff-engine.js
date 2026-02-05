export function diffObjects(a, b) {

  const diff = {};

  Object.keys(a).forEach(k => {

    if (a[k] != b[k]) {
      diff[k] = {
        before: a[k],
        after: b[k]
      };
    }

  });

  return diff;
}
