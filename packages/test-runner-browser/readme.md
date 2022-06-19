# @cankode/test-runner-browserr

> wip

`startTestServer` will glob search your disk for test files, build and serve them on the provided URL.
`testPage` will run the tests via Playwright in `chromium`, `webkit` and `firefox`

```ts
import { startTestServer, testPage } from '@cankode/test-runner-browser';

main();

async function main() {
  const [url, server] = await startTestServer('./**/*.spec.ts');
  try {
    await testPage(url);
  } finally {
    server.close();
  }
}
```