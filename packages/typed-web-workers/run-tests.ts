import {
  startTestServer,
  testPageInChromium,
  testPageInFirefox,
  testPageInWebkit,
} from '@cankode/test-runner-browser';

main();
async function main() {
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
