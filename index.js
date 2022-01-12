import fs from "fs";
const fsPromises = fs.promises;
let regex = /^[a-zA-Z]{5}$/;
import { scrabbleValues } from "./src/scrabble.js";
import { OfflineGuesser } from "./src/guessers/OfflineGuesser.js";
import solve from "./src/solver.js";
import { getSolutionForDate } from "./src/getSolution.js";

import { config } from "dotenv";
import { Client, Intents } from "discord.js";

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

config();

client.login(process.env.DISCORD_TOKEN);

const getFileAsArray = async (path) => {
  const data = await fs.promises.readFile(path);
  return data.toString().split("\n");
};

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
// fs.readFile("./res/initials.txt", "utf-8", (err, data) => {
//   const initials = data.split("\n");
//   let filter = arr.filter(
//     (word) =>
//       getValueOfWord(word) == 5 && removeDuplicateCharacters(word) == word
//   );
//   const file = fs.createWriteStream("./res/initials.txt");
//   filter.forEach(function (v) {
//     file.write(v.toLowerCase() + "\n");
//   });
//   file.end();
// });

client.on("ready", () => {
  // client.on("edfsfsgsg", () => {
  Promise.all([
    getFileAsArray("./res/initials.txt"),
    getFileAsArray("./res/words.txt"),
    client.channels.fetch("798641314064236596"),
  ]).then((res) => {
    const [initials, words, channel] = res;

    let date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    date.setTime(date.getTime() + ONE_DAY_IN_MS);

    console.log(date);

    const delay = date - new Date().getTime();
    console.log(delay);

    setTimeout(() => {
      setInterval(
        (() => {
          const [todayWord, number] = getSolutionForDate(new Date());
          let guesser = new OfflineGuesser(todayWord);

          shuffleArray(words);
          const [solved, result, attempts] = solve(initials, words, guesser);

          channel.send(
            `${
              solved
                ? "I was able to solve today's puzzle! 😀"
                : "I wasn't able to solve today's puzzle 😥"
            } \n\n Wordle ${number} ${result.length}/6 \n\n${result.join(
              "\n"
            )}\n\nYou can find the words I tried below`
          );
          channel.send(`||${attempts.join("-")}||`);
        })(),
        ONE_DAY_IN_MS
      );
    }, delay);

    //"798641314064236596" // NS
    //   console.log(`initials are ${initials.length}`)
    //   console.log(`words are ${words.length}`)
  });
});
const getValueOfWord = (word) => {
  return word
    .split("")
    .reduce((accum, letter) => accum + scrabbleValues[letter.toLowerCase()], 0);
};

const removeDuplicateCharacters = (string) => {
  return string
    .split("")
    .filter(function (item, pos, self) {
      return self.indexOf(item) == pos;
    })
    .join("");
};

const shuffleArray = (array) => {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};
