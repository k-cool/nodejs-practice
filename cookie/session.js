const http = require('http');
const fs = require('fs').promises;
const url = require('url');
const qs = require('querystring');

const parseCookies = (cookie = '') =>
  cookie
    .split(';')
    .map(el => el.split('='))
    .reduce((acc, [key, value]) => {
      acc[key.trim()] = decodeURIComponent(value);
      return acc;
    }, {});

const session = {};

const server = http.createServer(async (req, res) => {
  const cookies = parseCookies(req.headers.cookie);
  console.log('cookie', cookies);
  console.log('session', session);

  if (req.url.startsWith('/login')) {
    const { query } = url.parse(req.url);
    const { name } = qs.parse(query);
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 5);
    const uniquekey = Date.now();
    session[uniquekey] = { name, expires };

    res.writeHead(302, {
      Location: '/',
      'Set-Cookie': `session=${uniquekey}; Expires=${expires.toUTCString()}; HttpOnly; Path=/`,
    });
    res.end();
  } else if (cookies.session && session[cookies.session].expires > new Date()) {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`${session[cookies.session].name}님 안녕하세요!`);
  } else {
    try {
      const data = await fs.readFile('./cookie/index.html');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(err.message);
    }
  }
});

server.listen(8085, () => {
  console.log('8085번 포트에 서버가 열렸어요~!');
});
