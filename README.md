# Conversational Code Mapping with ChatGPT

This project enables collaborative code writing using ChatGPT by watching for changes in `.ask` files and updating the corresponding files as needed.

I have done alot of expermenting with GPT 4 which is what this project needs to work well. A few changes need to be made. Each file should its own chat. You ask gpt to pretend to be the file and it can respond with its comments as actual code comments etc. This works so well it is scary. I cant wait until we can move this chat gpt 4...

I got this close but completely missed the mark. massive update coming. cli -> coach on project file tree. describe structure. describe each file. select file back and forth writing file and generating description write a script that writes the file. left with file, description and script. cli switches between editing files and structure. you can edit the file and then it asks for description. or you can ask the ai to make changes and it appends the changes.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Creating and Updating .ask Files](#creating-and-updating-ask-files)
  - [File Changes and ChatGPT Interaction](#file-changes-and-chatgpt-interaction)
  - [Understanding Action Keywords](#understanding-action-keywords)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- An OpenAI API Key

### Installation

1. Clone the repository:

2. Change into the project directory:

3. Install the dependencies:

4. Create a `.env` file in the root of the project directory and add your OpenAI API key:

```
OPENAI_API_KEY=your_api_key_here
```

## Usage

### Creating and Updating .ask Files

Create a new `.ask` file in the `src` directory for each file you want to work on with ChatGPT.

Update the `.ask` file with the desired action keyword (MAKE, EDIT, DEBUG, or UPDATE) followed by your question or instructions for ChatGPT.

Save the `.ask` file to trigger the server to interact with ChatGPT and update the corresponding files.

### File Changes and ChatGPT Interaction

1. The server watches for changes in `.ask` files.
2. When a change is detected, it reads the action keyword and the question or instructions.
3. It sends the question to ChatGPT and processes the response.
4. Depending on the action keyword, it updates the corresponding files and saves the conversation to a `.convo` file.

### Understanding Action Keywords

- MAKE: Create a new file and add the specified code.
- EDIT: Edit an existing file with the specified changes or additions.
- DEBUG: Ask ChatGPT to debug an issue or error in the code.
- UPDATE: Update ChatGPT with the latest changes to a file and ask it what the file does.

Remember to manually review and incorporate the ChatGPT response from the `.answer` file into your codebase to maintain control over your code changes and benefit from any additional insights provided by the AI.
