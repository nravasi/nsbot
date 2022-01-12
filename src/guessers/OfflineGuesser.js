import { allIndexesOf } from "../utils.js";
let currentWord = "query";
import { MatchType } from "../matchType.js";

export class OfflineGuesser {
  constructor (word) {
    currentWord = word
  }
  guess = (word) => {
    var corrects = [],
      partials = [];

    for (let index = 0; index < word.length; index++) {
      const letter = word[index];

      if (letter == currentWord[index]) corrects.push(index);
    }

    if (corrects.length != currentWord.length) {
      for (let index = 0; index < word.length; index++) {
        if (!corrects.includes(index)) {
          const letter = word[index];
            const ocurrences = allIndexesOf(letter, currentWord);
            const partialIdxs = ocurrences.filter(
            (newIdx) => !corrects.includes(newIdx)
          );
          if (partialIdxs.length > 0 && timesAdded(word, [...partials, ...corrects], letter) < ocurrences.length) {
            partials.push(index);
          }
        }
      }
    }

    return [...Array(word.length)].map((item, i) =>
      corrects.includes(i)
        ? MatchType.CORRECT
        : partials.includes(i)
        ? MatchType.PARTIAL
        : MatchType.NO_MATCH
    );
  };
}

const timesAdded = (word, addedIdxs, letter) => {
    return addedIdxs.filter(idx => word[idx] == letter).length
}