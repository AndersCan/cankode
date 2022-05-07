import { Option, Some, None } from '../src/index';
import { Predicates } from '../src/Predicates';
import { describe, assert } from 'typed-tester';

const positiveNumber = (input: number): Option<number> => {
  if (input > 0) {
    return new Some(input);
  } else {
    return None;
  }
};

describe('Option - basic tests', function (test) {
  test.describe('Some', (test) => {
    test.it('isSome === true', function () {
      const some = positiveNumber(1);
      assert(some.isSome() === false);
    });
    test.it('isNone === false', function () {
      const some = positiveNumber(1);
      assert(some.isNone() === false);
    });
  });

  test.describe('None', (test) => {
    test.it('isSome === false', function () {
      const some = positiveNumber(-1);
      assert(some.isSome() === false);
    });
    test.it('isNone === true', function () {
      const some = positiveNumber(-1);
      assert(some.isNone() === true);
    });
    test.it('None has no get function ', function () {
      const none = positiveNumber(-1);
      assert('get' in none === false);
    });
  });

  test.it('a value is returned', function () {
    const some = positiveNumber(1);
    let result = -1;
    if (some.isSome()) {
      result = some.get();
    }
    assert(result === 1);
  });

  test.describe('Option.from', function (test) {
    test.it('returns None when given undefined', function () {
      const result = Option.from(undefined);
      assert(result.isNone());
    });
    test.it('returns None when given a undefined value', function () {
      const undefinedValues = [void 0, undefined, (() => {})()];
      const options = undefinedValues.map((o) => Option.from(o));
      const result = options.every((o) => o.isNone());
      assert(result);
    });
    test.it('returns Some when given a non-undefined value', function () {
      const nonUndefinedValues = [true, {}, -1, 1, 'A'];
      const options = nonUndefinedValues.map((o) => Option.from(o));
      const result = options.every((o) => o.isSome());
      assert(result);
    });

    test.it('predicate can disallow truth ', function () {
      const result = Option.from(true, () => false);
      assert(result.isNone());
    });
    test.it('predicate non-defined allows zero', function () {
      const result = Option.from(0, Predicates.DEFINED);
      assert(result.isSome());
    });
  });
});
