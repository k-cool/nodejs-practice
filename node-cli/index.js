#!/usr/bin/env node

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.clear();

const answerCallback = (answer) => {
  if (answer === "y") {
    console.log("good!");
    rl.close();
  } else if (answer === "n") {
    console.log("oh no!!!");
    rl.close();
  } else {
    console.log("y 또는 n 만 입력하세요");

    rl.question("예제가 재미있습니까?(y/n)", answerCallback);
  }
};

rl.question("예제가 재미있습니까?(y/n)", answerCallback);
