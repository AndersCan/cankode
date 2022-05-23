import { Option, Some, None } from '../src/index';
import { block, assert } from 'typed-tester';

const parseIntOption = (v: string): Option<number> => {
  const result = Number.parseInt(v);
  if (Number.isNaN(result)) {
    return None;
  } else {
    return new Some(result);
  }
};

block('Option - do', function (test) {
  test.it('Some - do does not change content ', function () {
    const some: Option<number> = parseIntOption('1');
    some
      .do((n) => n)
      .do((n) => n)
      .do((n) => n);
    assert(some.getOrElse(999) === 1);
  });
  test.it('Some - fn is called', function () {
    const some: Option<number> = parseIntOption('1');
    let result = 0;
    some.do((n) => (result = n));
    assert(result === 1);
  });
  test.it('None - does nothing', function () {
    const none: Option<number> = parseIntOption('abc');
    none.do(() => {
      throw new Error('should not be called');
    });
    assert(none.getOrElse(999) === 999);
  });
});
