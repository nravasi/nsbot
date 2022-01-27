import { MatchType } from "./matchType.js";
import { allIndexesOf, getValueOfWord } from "./utils.js";
import  isEqual from "lodash/isEqual.js";
import { scrabbleValues } from "./scrabble.js";

const solve = (initials, dictionary, guesser) => {
  let initialWord = initials[Math.floor(Math.random() * initials.length)];

  let solved = false;

  let conditions = [];
  let attempts = []
  let maxNumberOfOcurrences = {};
  let triedWords = [];
  let tried = 0;

  while (!solved && tried < 6) {
    let word =
      tried == 0
        ? initialWord
        : getNextWord(dictionary, triedWords, conditions, maxNumberOfOcurrences);

    if (word) {
      const result = guesser.guess(word);
      attempts.push(result)
      triedWords.push(word);

      [conditions, maxNumberOfOcurrences] = getNewConditions(
        word,
        result,
        conditions,
        maxNumberOfOcurrences
      );
    }
    solved = isSolved(conditions);
    tried++;
   /*  console.log(
      `Tried with ${word}, conditions are ${JSON.stringify(
        conditions
      )}, maxNum are ${JSON.stringify(maxNumberOfOcurrences)}`
    ); */
  }

  let result = attempts.map(element => {
    return element.map(type => mapTypeToEmoji(type)).join('')
  });

  return [solved, result, triedWords]
};

const mapTypeToEmoji = (type) => {
  switch(type){
      case MatchType.CORRECT:
        return "🟩";
      case MatchType.NO_MATCH:
        return "⬛️";
      case MatchType.PARTIAL:
        return "🟨";

  }
}
const isSolved = (conditions) => {
  return (
    conditions.filter((cond) => cond.type == MatchType.CORRECT).length == 5
  );
};

const getNewConditions = (word, result, conditions, maxNumberOfOcurrences) => {
  let partials = conditions.filter((cond) => cond.type == MatchType.PARTIAL);
  let newConditions = [
    ...conditions.filter((cond) => cond.type == MatchType.CORRECT),
  ];
  let lettersToAddMaxes = [];

  for (let index = 0; index < word.length; index++) {
    const letter = word[index];

    const type = result[index];
    let condition = createCondition(letter, index, type);

    if (type == MatchType.NO_MATCH) {
      lettersToAddMaxes.push(letter);
    } else {
      if (!newConditions.some(val => isEqual(val, condition))) newConditions.push(condition);

      if (condition.type === MatchType.CORRECT) {
        partials = partials.filter(
          (cond) =>
            !(cond.letter == condition.letter && cond.type == MatchType.PARTIAL)
        );

        //mix partials so they are repeated
      }
    }
  }

  let newMaxes = {
    ...maxNumberOfOcurrences,
    ...lettersToAddMaxes.reduce((map, letter) => {
      map[letter] =
        newConditions.filter(
          (cond) => cond.letter === letter && cond.type === MatchType.CORRECT
        ).length +
          newConditions.filter(
            (cond) => cond.letter === letter && cond.type === MatchType.PARTIAL
          ).length >
        0
          ? 1
          : 0;
      return map;
    }, {}),
  };

  return [newConditions, newMaxes];
};


const createCondition = (letter, index, type) => {
  return { letter: letter, index: index, type: type };
};

const satisfiesAllConditions = (word, conditions, maxNumberOfOcurrences) => {
  return (
    conditions.every((cond) => satisfiesCondition(word, cond)) &&
    Object.keys(maxNumberOfOcurrences).every((letter) =>
      satisfiesMaxNumber(letter, word, maxNumberOfOcurrences)
    )
  );
};

const satisfiesMaxNumber = (letter, word, maxNumberOfOcurrences) => {
  return allIndexesOf(letter, word).length <= maxNumberOfOcurrences[letter];
};

const satisfiesCondition = (word, condition) => {
  switch (condition.type) {
    case MatchType.CORRECT:
      return word[condition.index] === condition.letter;
    case MatchType.NO_MATCH:
      return word.index;
    case MatchType.PARTIAL:
      let index = word.indexOf(condition.letter);
      return index >= 0 && index != condition.index;
  }
};

export default solve;


function getNextWord(dictionary, triedWords, conditions, maxNumberOfOcurrences) {
  const arr = dictionary.filter(
    (w) => !triedWords.includes(w) &&
      satisfiesAllConditions(w, conditions, maxNumberOfOcurrences)
  ).sort((a, b) => {
    return getValueOfWord(a, scrabbleValues) - getValueOfWord(b, scrabbleValues);
  });
    return arr[0];
}

//asuri, brome, deere, grype
//slait-cymae-wonga-farro

