# @cankode/tester

> wip

Write tests to be run via `@cankode/test-runner-browser` and/or `@cankode/test-runner-node`.


```ts
import { block, assert } from '@cankode/tester';

block('A', test => {
  test.describe('AA', test => {
    test.it('something is true', () => {
      assert(true === true);
    });
    test.it('something is false', () => {
      assert(true === false); // will fail
    });
  });
});
```

Note: built-in assert is dead-simple boolean asserter. Bring your own if you want something more powerfull.