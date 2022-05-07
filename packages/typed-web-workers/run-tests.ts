import { startTestServer, testPage } from 'typed-test-runner-browser';

main();
async function main() {
  const [url, server] = await startTestServer('./**/*.spec.ts');
  try {
    await testPage(url);
  } finally {
    server.close();
  }
}
