import fs from "fs";
const fsPromises = fs.promises;
let regex = /^[a-zA-Z]{5}$/;
import { scrabbleValues } from "./src/scrabble.js";
import { OfflineGuesser } from "./src/guessers/OfflineGuesser.js";
import solve from "./src/solver.js";
import { getSolutionForDate } from "./src/getSolution.js";

import { config } from "dotenv";
import { Client, Intents } from "discord.js";

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

config();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  //"798641314064236596" // NS


  client.channels.fetch("930628066949095468").then(channel => {
    channel.send("hollaaaaaa")
  })
});

client.login(process.env.DISCORD_TOKEN);

const getFileAsArray = async (path) => {
  const data = await fs.promises.readFile(path);
  return data.toString().split("\n");
};

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

Promise.all([
  getFileAsArray("./res/initials.txt"),
  getFileAsArray("./res/words.txt"),
]).then((res) => {
  const [initials, words] = res;
  //   console.log(`initials are ${initials.length}`)
  //   console.log(`words are ${words.length}`)
  // const todayWord = getSolutionForDate(new Date());

  // console.log(`Solution is ${todayWord}`);

  // let guesser = new OfflineGuesser(todayWord);
  // //   let guesser = new WordleGuesser()

  // shuffleArray(words);
  // solve(initials, words, guesser);
  // console.log(guesser.guess('brome'))
  // console.log(guesser.guess('agggo'))
  // console.log(guesser.guess('aggro'))
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
