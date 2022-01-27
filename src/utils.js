export const allIndexesOf = (char, string) => {
  var a = [],
    i = -1;
  while ((i = string.indexOf(char, i + 1)) >= 0) a.push(i);
  return a;
};

export const getValueOfWord = (word, scrabbleValues) => {
  return word
    .split("")
    .reduce((accum, letter) => accum + scrabbleValues[letter.toLowerCase()], 0);
};
