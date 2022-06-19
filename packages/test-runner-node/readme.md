# @cankode/test-runner-node


`runTests` will glob search your disk and run every match it finds

```ts
// run-test.ts

import { runTests } from '@cankode/test-runner-node';

main();
async function main() {
  runTests('./**/*.spec.ts');
}
```