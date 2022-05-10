import { runTests } from 'typed-test-runner-node';
import { startTestServer, testPage } from 'typed-test-runner-browser';

main();

async function main() {
  runTests('./**/*.spec.ts');
  const [url, server] = await startTestServer('./**/*.spec.ts');
  try {
    await testPage(url);
  } finally {
    server.close();
  }
}
