const http = require('http');
const fs = require('fs').promises;

const server = http.createServer(async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  const page = await fs.readFile('./cluster/index.html');
  res.end(page);
});

server.listen(8080, () => {
  console.log('8080포트에 서버가 열렸어요~!');
});
