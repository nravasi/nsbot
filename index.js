import fs from "fs";
const fsPromises = fs.promises;
let regex = /^[a-zA-Z]{5}$/;
import { scrabbleValues } from "./src/scrabble.js";
import { OfflineGuesser } from "./src/guessers/OfflineGuesser.js";
import solve from "./src/solver.js";
import { getSolutionForDate } from "./src/getSolution.js";
import { allIndexesOf, getValueOfWord } from "./src/utils.js";

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
// fs.readFile("./res/words.txt", "utf-8", (err, data) => {
//   const initials = data.split("\n");
//   let filter = initials.filter(
//     (word) =>
//       getValueOfWord(word, scrabbleValues) == 5 && removeDuplicateCharacters(word) == word
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
    client.channels.fetch("798641314064236596"), //NS
    // client.channels.fetch("930628066949095468"), //Playground
  ]).then((res) => {
    const [initials, words, channel] = res;

    let date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    date.setTime(date.getTime() + ONE_DAY_IN_MS);

    console.log(date);

    const delay = date - new Date().getTime();
    console.log(delay);
    // justSolve(words, initials, channel);

    client.on("message", (message) => {
      //this event is fired, whenever the bot sees a new message
      if (
        message.mentions.has(client.user.id) &&
        message.content.toLowerCase().includes("solve")
      ) {
        //we check, whether the bot is mentioned, client.user returns the user that the client is logged in as
        solveAndSend(words, initials, channel);
      }
    });
    //"798641314064236596" // NS
    //   console.log(`initials are ${initials.length}`)
    //   console.log(`words are ${words.length}`)
  });
});

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

function solveAndSend(words, initials, channel) {
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
}

function justSolve(words, initials) {
  const [todayWord, number] = getSolutionForDate(new Date());
  let guesser = new OfflineGuesser(todayWord);

  const [solved, result, attempts] = solve(initials, words, guesser);

  console.log(
    `${
      solved
        ? "I was able to solve today's puzzle! 😀"
        : "I wasn't able to solve today's puzzle 😥"
    } \n\n Wordle ${number} ${result.length}/6 \n\n${result.join(
      "\n"
    )}\n\nYou can find the words I tried below`
  );
  console.log(`${attempts.join("-")}`);
}
