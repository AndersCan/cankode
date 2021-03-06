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

block('Option - combine', function (test) {
  test.describe('Some', (test) => {
    test.it('returns correct string', function () {
      const somes: Option<string>[] = [Option.from('A'), Option.from('B')];
      const result: Option<string> = Option.combine((a, b) => `${a}${b}`)(
        somes[0],
        somes[1]
      );
      assert(result.getOrElse('fail') === 'AB');
    });
    test.it('can return different type', function () {
      const somes: Option<number>[] = [
        parseIntOption('1'),
        parseIntOption('2'),
      ];
      const reducer = Option.combine(
        (prev: number, curr: number) => `${prev}${curr}`
      );
      const result: Option<string> = reducer(somes[0], somes[1]);
      assert(result.getOrElse('fail') === '12');
    });
    test.it('can use combine with [].reduce', function () {
      const somes: Option<number>[] = [
        parseIntOption('1'),
        parseIntOption('2'),
        parseIntOption('3'),
      ];
      const reducer = Option.combine(
        (prev: number, curr: number) => prev + curr
      );
      const result = somes.reduce(reducer);
      assert(result.getOrElse(-999) === 6);
    });

    test.it('can return different type with [].reduce', function () {
      const somes: Option<number>[] = [
        parseIntOption('4'),
        parseIntOption('5'),
      ];
      const reducer = Option.combine(
        (prev: string, curr: number) => `${prev}${curr}`
      );
      const result: Option<string> = somes.reduce(reducer, new Some('123'));
      assert(result.getOrElse('fail') === '12345');
    });
  });

  test.describe('None', (test) => {
    test.it('returns none if first option is None', function () {
      const nones: Option<number>[] = [
        parseIntOption('A'),
        parseIntOption('2'),
      ];
      const reducer = Option.combine(
        (prev: number, curr: number) => `${prev}${curr}`
      );
      const result: Option<string> = reducer(nones[0], nones[1]);
      assert(result.getOrElse('fail') === 'fail');
    });
    test.it('returns none if second option is None', function () {
      const nones: Option<number>[] = [
        parseIntOption('1'),
        parseIntOption('B'),
      ];
      const reducer = Option.combine(
        (prev: number, curr: number) => `${prev}${curr}`
      );
      const result: Option<string> = reducer(nones[0], nones[1]);
      assert(result.getOrElse('fail') === 'fail');
    });
    test.it('can use combine with [].reduce', function () {
      const somes: Option<number>[] = [
        parseIntOption('1'),
        parseIntOption('a2a'),
        parseIntOption('3'),
      ];
      const reducer = Option.combine(
        (prev: number, curr: number) => prev + curr
      );
      const result = somes.reduce(reducer);
      assert(result.getOrElse(-999) === -999);
    });
  });
});
