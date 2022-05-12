# typed-tester

> wip

Write tests to be run via `typed-test-runner-browser` and/or `typed-test-runner-node`.


```ts
import { describe, assert } from 'typed-tester';

describe('A', test => {
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