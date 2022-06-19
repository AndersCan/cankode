import { runTests } from 'typed-test-runner-node';
import {
  startTestServer,
  testPageInChromium,
  testPageInFirefox,
  testPageInWebkit,
} from 'typed-test-runner-browser';

main();

async function main() {
  await runTests('./**/*.spec.ts');
  const [url, server] = await startTestServer('./**/*.spec.ts');
  try {
    await Promise.all([
      testPageInChromium(url),
      testPageInFirefox(url),
      testPageInWebkit(url),
    ]);
  } finally {
    server.close();
  }
}
