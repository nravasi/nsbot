import { MatchType } from "./matchType";

class Condition {
  letter = "~";
  index = -1;
  type = MatchType.NO_MATCH;

  constructor(letter, index, type) {
    this.letter = letter;
    this.index = index;
    this.type = type;
  }
}
