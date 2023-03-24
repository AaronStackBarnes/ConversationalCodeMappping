import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function processAskFile(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf8");
  const [action, ...questionParts] = fileContent.trim().split(" ");
  const question = questionParts.join(" ");

  const convoFilePath = filePath.replace(".ask", ".convo");
  const convoContent = `DATE: ${+new Date()}\nACTION: ${action}\nQUESTION: ${question}\n\n\n`;

  if (fs.existsSync(convoFilePath)) {
    fs.appendFileSync(convoFilePath, convoContent, "utf8");
  } else {
    fs.writeFileSync(convoFilePath, convoContent, "utf8");
  }
}

const askFilePath = process.argv[2];
if (askFilePath) {
  processAskFile(askFilePath);
} else {
  console.log("Usage: node <script> <path-to-ask-file>");
}
