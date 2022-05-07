import { createServer } from 'http';
import { getHtmlFile } from 'typed-tester/runner';

const html = getHtmlFile('./**/*.spec.ts');
const hostname = '127.0.0.1';
const port = 3000;

const server = createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  html.then(h => {
    res.end(h);
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
