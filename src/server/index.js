import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
import chokidar from "chokidar";
import { ChatGPTAPI } from "chatgpt";
import { fileURLToPath } from "url";

import appConfig from "../../config.json" assert { type: "json" };

dotenv.config();

const configFileName = "config.json";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDirectory = path.join(__dirname, "..", "..", "src");
const projectName = srcDirectory.split("/")[srcDirectory.split("/").length - 1];
let debounce = "";

(async () => {
  const chatGptApi = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  let options = {};
  let parentMessageId = await getParentMessageId();
  if (parentMessageId) {
    options.parentMessageId = parentMessageId;
  }

  const watcher = chokidar.watch(srcDirectory, {
    ignored: /node_modules/,
    persistent: true,
  });

  watcher.on("change", async (filePath) => {
    await handleFileChange(filePath);
  });

  async function handleFileChange(filePath) {
    if (path.extname(filePath) != ".ask") return;

    const questionData = fs.readFileSync(filePath, "utf8").split(" ");
    if (questionData.length < 2) return;

    let question;
    const action = questionData.shift();
    const convoFilePath = filePath.replace(".ask", ".convo");
    const mainFilePath = filePath.replace(".ask", "");
    const answerFilePath = filePath.replace(".ask", ".answer");

    if (answerFilePath === debounce) {
      return;
    } else {
      debounce = answerFilePath;
      setTimeout(() => (debounce = ""), 1000);
    }

    if (action === "MAKE") {
      question = `I am working on a file called ${mainFilePath} please show me the code that I will but in it. It should be ${questionData.join(
        " "
      )}. Please respond with exactly what I should put in the file.`;
    } else if (action === "EDIT") {
      question = `I am working on the file ${mainFilePath} ${questionData.join(
        " "
      )}. Please respond with exactly what I should put in the file. Respond with the code for the entire file.`;
    } else if (action === "DEBUG") {
      question = `I am working on the file ${mainFilePath} but it is not working: ${questionData.join(
        " "
      )}. Please tell me what is wrong with it.`;
    } else if (action === "UPDATE") {
      question = `I am working on the file ${mainFilePath} I have made changes to it please tell me what this file does. ${questionData.join(
        " "
      )}`;
    } else {
      question = `I am working on the file ${mainFilePath} I have a few questions about it. ${questionData.join(
        " "
      )}`;
    }

    try {
      console.log(question);
      console.log("");
      const res = await chatGptApi.sendMessage(question, options);
      let answer = res.text.trim();
      console.log(answer);
      console.log("");

      if (!options.parentMessageId) {
        options.parentMessageId = res.id;
        setParentMessageId(res.id);
      }

      const mainFile = answer
        ?.replace("```html", "```")
        .replace("```javascript", "```")
        .split("```")?.[1];

      if (action == "CODE") {
        answer = "UPDATED_CODE";
      }

      if (action === "DEBUG" || action === "UPDATE") {
        fs.writeFileSync(answerFilePath, answer);
      } else if (
        (action == "CODE" && !appConfig.prependCode) ||
        action == "MAKE"
      ) {
        const mainFile = answer?.replace("```html", "```").split("```")?.[1];
        fs.writeFileSync(mainFilePath, mainFile);
        fs.writeFileSync(answerFilePath, answer);
      } else {
        const oldFile = fs.readFileSync(mainFilePath);
        fs.writeFileSync(
          mainFilePath,
          `***************UPDATE***************\n\n${mainFile}\n\n***************END_UPDATE***************\n\n${oldFile}`
        );
        fs.writeFileSync(answerFilePath, answer);
      }

      const convoContent = `DATE: ${+new Date()}\n QUESTION: ${question}\nANSWER: ${answer} \n\n\n`;
      fs.appendFileSync(convoFilePath, convoContent, "utf8");
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function getParentMessageId() {
    try {
      const configFilePath = path.join(process.cwd(), configFileName);

      if (fs.existsSync(configFilePath)) {
        const configFileContent = await fs.promises.readFile(
          configFilePath,
          "utf-8"
        );
        const config = JSON.parse(configFileContent);
        return config.parentMessageId;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error reading the config file:", error);
      return false;
    }
  }

  async function setParentMessageId(parentMessageId) {
    try {
      const configFilePath = path.join(process.cwd(), configFileName);

      let configFileContent;
      if (fs.existsSync(configFilePath)) {
        configFileContent = await fs.promises.readFile(configFilePath, "utf-8");
      }

      const config = JSON.parse(configFileContent);
      config.parentMessageId = parentMessageId;

      configFileContent = JSON.stringify(config, null, 2);
      await fs.promises.writeFile(configFilePath, configFileContent, "utf-8");
      console.log("Parent message ID saved successfully.");
    } catch (error) {
      console.error("Error writing to the config file:", error);
    }
  }
})();

process.stdin.resume();
