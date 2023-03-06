import * as dotenv from "dotenv";
import { fetchTranscript } from "./transcript/fetchTranscript";
import { parseTranscript } from "./transcript/parseTranscript";
import readline from "readline/promises";

//https://chat.openai.com/api/auth/session
dotenv.config();

const CHAT_MODE = true;
const URL = "https://youtu.be/BagY2Mnz-TU";

async function main() {
  const rl = readline.createInterface(process.stdin, process.stdout);
  const url = await rl.question("Please Enter the Video URL:");

  //@ts-ignore
  const transcript = await fetchTranscript(url);
  // console.log(transcript);

  const parsedTranscript = parseTranscript(transcript);

  const withTimestamp = await rl.question("Print with timestamp? (y/n)");
  if (withTimestamp === "y") {
    console.log(parsedTranscript.getPrintableFormat(true));
  } else {
    console.log(parsedTranscript.getPrintableFormat(false));
  }
}

main();
