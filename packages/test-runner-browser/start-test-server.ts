import type { Server } from 'http';
import { createServer } from 'http';
import { getHtmlFile } from './get-html-file';

export function startTestServer(globPattern: string | string[]) {
  return new Promise<[string, Server]>((resolve) => {
    const htmlPromise = getHtmlFile(globPattern);
    const hostname = '127.0.0.1';
    const port = 0;

    const server = createServer((req, res) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      htmlPromise.then((html) => res.end(html));
    });

    server.listen(port, hostname, () => {
      const address = server.address();

      if (address === null || typeof address === 'string') {
        throw new Error('Server address is a string :/');
      }

      const serverAddress = `http://${address.address}:${address.port}/`;
      resolve([serverAddress, server]);
    });
  });
}
