import { Option, Some, None } from '../src/index';
import { block, assert } from '@cankode/tester';

const positiveNumber = (input: number): Option<number> => {
  if (input > 0) {
    return new Some(input);
  } else {
    return None;
  }
};
interface Person {
  name: string;
  middleName?: string;
}
const people: Person[] = [
  {
    name: 'NoMiddleName',
  },
  {
    name: 'HasMiddleName',
    middleName: 'MyMiddleName',
  },
];
const findPerson = (input: string): Option<Person> => {
  const result = people.find((p) => p.name === input);
  if (result) {
    return new Some(result);
  } else {
    return None;
  }
};
const getMiddleName = (person: Person): Option<string> => {
  if (person.middleName) {
    return new Some(person.middleName);
  } else {
    return None;
  }
};
block('Option - None - functions', function (test) {
  test.describe('Map', function (test) {
    test.it('map on None returns None ', function () {
      const none = positiveNumber(-1);
      const result = none.map((a) => '' + a);
      assert(result.isNone());
    });

    test.it('map does not call fn', function () {
      const none = positiveNumber(-1);
      const result = none.map((a) => {
        throw Error('none should not call fn');
      });
      assert(result.isNone());
    });
  });

  test.describe('flatMap', function (test) {
    test.it('return None for a non-existing person', function () {
      const none = findPerson('DoesNotExist');
      const result = none.flatMap(getMiddleName);
      assert(result.isNone());
    });

    test.it('does not call fn', function () {
      const none = findPerson('DoesNotExist');
      const result = none.flatMap((a) => {
        throw Error('none should not call fn');
      });
      assert(result.isNone());
    });
  });

  test.describe('getOrElse', function (test) {
    test.it("returns 'else' value", function () {
      const none = positiveNumber(-1);
      const result = none.getOrElse(() => 100);
      assert(result === 100);
    });
    test.it('can return other constant type', function () {
      const none = positiveNumber(-1);
      const result = none.getOrElse('text');
      assert(result === 'text');
    });
    test.it('can return other fn types', function () {
      const none = positiveNumber(-1);
      const result = none.getOrElse(() => 'text');
      assert(result === 'text');
    });
  });

  test.describe('orElse', function (test) {
    test.it("returns 'orElse' value", function () {
      const none = positiveNumber(-1);
      const result = none.orElse(() => positiveNumber(1));
      assert(result.isSome());
    });
    test.it("returns correct 'orElse' value", function () {
      const none = positiveNumber(-1);
      const result = none.orElse(() => positiveNumber(1));
      assert(result.getOrElse(() => -1) === 1);
    });
    test.it('can return other fn type', function () {
      const none = positiveNumber(-1);
      const result = none.orElse(() => Option.from('text'));
      assert(result.getOrElse(() => -1) === 'text');
    });
    test.it('can return other constant type', function () {
      const none = positiveNumber(-1);
      const result = none.orElse(Option.from('text'));
      assert(result.getOrElse(() => -1) === 'text');
    });
  });
});
