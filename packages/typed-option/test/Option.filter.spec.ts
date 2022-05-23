import { Option, Some, None } from '../src/index';
import { block, assert } from 'typed-tester';

const positiveNumber = (input: number): Option<number> => {
  if (input > 0) {
    return new Some(input);
  } else {
    return None;
  }
};

block('filter', function (test) {
  test.describe('none', function (test) {
    test.it('returns None', function () {
      const none = positiveNumber(-1);
      const result = none.filter((a) => true);
      assert(result.isNone());
    });
  });
  test.describe('some', function (test) {
    test.it('returns None with false predicate', function () {
      const some = positiveNumber(1);
      const result = some.filter(() => false);
      assert(result.isNone());
    });
    test.it('returns Some with true predicate', function () {
      const some = positiveNumber(1);
      const result = some.filter(() => true);
      assert(result.isSome());
    });
    test.it('returns Some with false predicate', function () {
      const some = positiveNumber(1);
      const result = some.filter(() => true);
      if (result.isSome()) {
        assert(result.get() === 1);
      }
    });
  });
});
