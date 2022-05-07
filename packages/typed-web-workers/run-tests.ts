import { startTestServer } from 'typed-tester/start-test-server';
import { testPage } from 'typed-tester/browser-runner';

main();
async function main() {
  const [url, server] = await startTestServer();
  await testPage(url);
  server.close();
}
