import { Option, Some, None } from '../src/index';
import { block, assert } from '@cankode/tester';

const parseIntOption = (v: string): Option<number> => {
  const result = Number.parseInt(v);
  if (Number.isNaN(result)) {
    return None;
  } else {
    return new Some(result);
  }
};

block('Option - match', function (test) {
  test.describe('functions', function (test) {
    test.it('returns some', function () {
      const some = parseIntOption('1000');
      const result = some.match({
        none: () => 'none',
        some: () => 'some',
      });
      assert(result === 'some');
    });
    test.it('return none', function () {
      const some = parseIntOption('text');
      const result = some.match({
        none: () => 'none',
        some: () => 'some',
      });
      assert(result === 'none');
    });
  });

  test.describe('constants', function (test) {
    test.it('returns some', function () {
      const some = parseIntOption('1000');
      const result = some.match({
        none: 'none',
        some: 'some',
      });
      assert(result === 'some');
    });
    test.it('return none', function () {
      const some = parseIntOption('text');
      const result = some.match({
        none: 'none',
        some: 'some',
      });
      assert(result === 'none');
    });
  });

  test.describe('hybrids - functions and constants', function (test) {
    test.it('fn - returns some', function () {
      const some = parseIntOption('1000');
      const result = some.match({
        none: 'none',
        some: () => 'some',
      });
      assert(result === 'some');
    });
    test.it('fn - return none', function () {
      const none = parseIntOption('text');
      const result = none.match({
        none: 'none',
        some: () => 'some',
      });
      assert(result === 'none');
    });
    test.it('fn - return none', function () {
      const some = parseIntOption('text');
      const result = some.match({
        none: () => 'none',
        some: 'some',
      });
      assert(result === 'none');
    });
    test.it('fn - return none', function () {
      const some = parseIntOption('text');
      const result = some.match({
        none: 'none',
        some: () => 'some',
      });
      assert(result === 'none');
    });
  });
  test.describe('can return different types', function (test) {
    test.it('return a some', function () {
      const some = parseIntOption('1000');
      const result = some.match({
        none: () => 'none',
        some: () => 123,
      });
      assert(result === 123);
    });
    test.it('returns a none', function () {
      const none = parseIntOption('text');
      const result = none.match({
        none: 123,
        some: () => 'some',
      });
      assert(result === 123);
    });
  });
});
