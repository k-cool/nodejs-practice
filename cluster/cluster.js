const cluster = require('cluster');
const fs = require('fs').promises;
const http = require('http');

const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`마스터 프로세스 아이디: ${process.pid}`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`${worker.process.pid}번 워커가 종료되었습니다.`);
    console.log('code', code, 'signal', signal);

    // 종료되면 다시 살리기
    cluster.fork();
  });
} else {
  const server = http.createServer(async (req, res) => {
    console.log(`${process.pid}번 워커 작업 실행!`);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    const page = await fs.readFile('./cluster/index.html');
    res.end(page);

    setTimeout(() => {
      process.exit(1);
    }, 1000);
  });

  server.listen(8086, () => {
    console.log('8086포트에 서버가 열렸어요~!');
  });

  console.log(`${process.pid}번 워커 실행`);
}
