export const allIndexesOf = (char, string) => {
    var a = [],
      i = -1;
    while ((i = string.indexOf(char, i + 1)) >= 0) a.push(i);
    return a;
  };

