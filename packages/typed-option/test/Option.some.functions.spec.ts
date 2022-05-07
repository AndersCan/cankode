import { Option, Some, None } from '../src/index';
import { describe, assert } from 'typed-tester';

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
describe('Option - Some - functions', function (test) {
  describe('Map', function (test) {
    test.it('map on Some returns Some', function () {
      const some = positiveNumber(1);
      const result = some.map((a) => a);
      assert(result.isSome());
    });

    test.it('map applies fn to parameter', function () {
      const some = positiveNumber(1);
      const mapped = some.map((a) => 'Mapped-' + a);
      let result = '';
      if (mapped.isSome()) {
        result = mapped.get();
      }
      assert(result === 'Mapped-1');
    });
    test.it('map can return false', function () {
      const some = positiveNumber(1);
      const mapped = some.map((a) => false);
      let result = true;
      if (mapped.isSome()) {
        result = mapped.get();
      }
      assert(result === false);
    });
    test.it('map can return {}', function () {
      const option = Option.from({});
      const result = option.map((_) => _);
      assert(result.isSome() === true);
    });
    test.it('map can return all falsy values', function () {
      const some = positiveNumber(1);
      const mapped = some
        .map((a) => false)
        .map((a) => 0)
        .map((a) => '')
        .map((a) => ({}))
        .map((a) => false);
      let result = true;
      if (mapped.isSome()) {
        result = mapped.get();
      }
      assert(result === false);
    });
  });

  describe('flatMap', function (test) {
    test.it('returns None when no middleName', function () {
      const some = findPerson('NoMiddleName');
      const result = some.flatMap(getMiddleName);
      assert(result.isSome() === false);
    });

    test.it('returns Some with middlename', function () {
      const some = findPerson('HasMiddleName');
      const result = some.flatMap(getMiddleName);
      assert(result.isSome());
    });

    test.it('value returned is expected string', function () {
      const some = findPerson('HasMiddleName');
      const someMiddleName = some.flatMap(getMiddleName);
      let result = '';
      if (someMiddleName.isSome()) {
        result = someMiddleName.get();
      }
      assert(result === 'MyMiddleName');
    });
  });

  describe('getOrElse', function (test) {
    test.it("does not return 'else' value", function () {
      const some = positiveNumber(1);
      const result = some.getOrElse(() => -999);
      assert(result === 1);
    });
    test.it("does not return 'else' value", function () {
      const some = positiveNumber(1);
      const result = some.getOrElse(() => -999);
      assert(result === 1);
    });
    test.it("does not call 'else' function", function () {
      const some = positiveNumber(1);
      const result = some.getOrElse(() => {
        throw Error('none should not call fn');
      });
      assert(result === 1);
    });
    test.it('can return other constant type', function () {
      const some = positiveNumber(1);
      const result = some.getOrElse('text');
      assert(result === 1);
    });
    test.it('can return other fn types', function () {
      const some = positiveNumber(1);
      const result = some.getOrElse(() => 'text');
      assert(result === 1);
    });
  });

  describe('orElse', function (test) {
    test.it("does not return 'else' value", function () {
      const some = positiveNumber(1);
      const result = some.orElse(() => positiveNumber(-1));
      assert(result.isSome());
    });
    test.it('returns correct value', function () {
      const some = positiveNumber(1);
      const result = some.orElse(() => positiveNumber(-1));
      if (result.isSome()) {
        assert(result.get() === 1);
      }
    });
    test.it('can return other fn type', function () {
      const some = positiveNumber(1);
      const result = some.orElse(() => Option.from('text'));
      assert(result.getOrElse(() => -1) === 1);
    });
    test.it('can return other constant type', function () {
      const some = positiveNumber(1);
      const result = some.orElse(Option.from('text'));
      assert(result.getOrElse(() => -1) === 1);
    });
  });
});
