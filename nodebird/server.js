const app = require("./app");

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에 서버가 열렸어요~!");
});
