import * as fc from 'fast-check';
import { Option } from '../src/index';
import { block } from 'typed-tester';

// Properties
block('Option - basic properties', (test) => {
  const isUndefinedOrNull = (x: any) => x === undefined || x === null;
  test.it('Only undefined and null give None from "Option.from"', () => {
    fc.assert(
      fc.property(fc.anything(), (anything) => {
        const opt = Option.from(anything);
        const isUndefinedOrNullResult = isUndefinedOrNull(anything);
        return opt.isNone()
          ? isUndefinedOrNullResult === true
          : isUndefinedOrNullResult === false;
      })
    );
  });
});
