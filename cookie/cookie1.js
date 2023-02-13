const http = require('http');

const server = http.createServer((req, res) => {
  console.log(req.url, req.headers.cookie);
  res.writeHead(200, { 'Set-Cookie': 'mycookie=test' });
  res.end('Hello Cookie');
});

server.listen(8083, () => {
  console.log('8083번 포트에 쿠키서버가 열렸어요~!');
});
