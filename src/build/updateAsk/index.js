// update.js
import fs from "fs";
import path from "path";
import process from "process";

if (process.argv.length < 3) {
  console.error("Please provide a file path as an argument.");
  process.exit(1);
}

const inputFilePath = process.argv[2];
const inputFileContent = fs.readFileSync(inputFilePath, "utf8");
const askFilePath = `${inputFilePath}.ask`;

const askFileContent = `UPDATE ${inputFileContent}`;

fs.writeFileSync(askFilePath, askFileContent, "utf8");
console.log(`Updated ${askFilePath} with content from ${inputFilePath}`);
