#!/usr/bin/env node

const { program } = require("commander");
const package = require("./package.json");
const fs = require("fs");
const path = require("path");

const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body></body>
</html>
`;

const routerTemplate = `
const express = require("express");

const router = express.Router();

router //
  .route("/")
  .get(async (req, res, next) => {
    try {
      res.send("ok");
    } catch (err) {
      console.error(err);
    }
  });

module.exports = router;
`;

const exist = (dir) => {
  try {
    fs.accessSync(
      dir,
      fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK
    );
    return true;
  } catch (err) {
    return false;
  }
};

const mkdirp = (dir) => {
  const dirname = path
    .relative(".", path.normalize(dir))
    .split(path.sep)
    .filter((p) => !!p);

  dirname.forEach((d, idx) => {
    const pathBuilder = dirname.slice(0, idx + 1).join(path.sep);

    if (!exist(pathBuilder)) {
      fs.mkdirSync(pathBuilder);
    }
  });
};

const makeTemplate = (type, name, directory) => {
  mkdirp(directory);

  if (type === "html") {
    const pathToFile = path.join(directory, `${name}.html`);
    if (exist(pathToFile)) {
      console.error("이미 해당 파일이 존재합니다.");
    } else {
      fs.writeFileSync(pathToFile, htmlTemplate);
      console.log(pathToFile, "생성완료");
    }
  } else if (type === "express-router") {
    const pathToFile = path.join(directory, `${name}.js`);
    if (exist(pathToFile)) {
      console.error("이미 해당 파일이 존재합니다.");
    } else {
      fs.writeFileSync(pathToFile, routerTemplate);
      console.log(pathToFile, "생성완료");
    }
  } else {
    console.error("타입은 html, express-router 중 하나입니다.");
  }
};

program //
  .version(`${package.version}`, "-v, --version")
  .name("cli");

program
  .command("template <type>")
  .usage("<type> --filename [filename] --path [path]")
  .description("템플릿을 생성합니다.")
  .alias("tmpl")
  .option("-f, --filename [filename]", "파일명을 입력하세요.", "index")
  .option("-d, --directory [path]", "생성 경로를 입력하세요.", ".")
  .action((type, options) => {
    console.log(type, options.filename, options.directory);
    makeTemplate(type, options.filename, options.directory);
  });

program //
  .command("*", { noHelp: true })
  .action(() => {
    console.log("해당 명령어를 찾을 수 없습니다.");
    program.help();
  });

program.parse(process.argv);
