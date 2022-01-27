export const allIndexesOf = (char, string) => {
  var a = [],
    i = -1;
  while ((i = string.indexOf(char, i + 1)) >= 0) a.push(i);
  return a;
};

export const getValueOfWord = (word, scrabbleValues) => {
  let temp = {}
  return word
    .split("")
    .reduce((accum, letter) => {
      let base = temp[letter] ? 2: 0
      temp[letter] = true
      return base + accum + scrabbleValues[letter.toLowerCase()]}, 0);
};
