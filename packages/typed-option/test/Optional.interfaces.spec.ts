import { Option } from '../src/index';
import { describe, assert } from 'typed-tester';

interface Single {
  a?: string;
}
interface IA {
  val: 'A';
  a?: IB;
}

interface IB {
  val: 'B';
  b?: IC;
}

interface IC {
  val: 'C';
  c: string;
}

const UndefinedA: IA = {
  val: 'A',
};

const A: IA = {
  val: 'A',
  a: {
    val: 'B',
    b: {
      val: 'C',
      c: 'ABC',
    },
  },
};

const B2: IB = {
  val: 'B',
  b: {
    val: 'C',
    c: 'ABC2',
  },
};
const B3: IB = {
  val: 'B',
  b: {
    val: 'C',
    c: 'ABC3',
  },
};
const A3: IA = {
  val: 'A',
  a: B3,
};
const single: Single = {
  a: 'single',
};

function stringOrUndefinedFn(a: string): string | undefined {
  return a;
}

describe('Option - working with Interfaces', function (test) {
  test.it(
    'Option.from called with `string | undefined` returns `string`',
    function () {
      const stringOrUndefined = single.a;
      const opt: Option<string> = Option.from(stringOrUndefined);
      const some: string = opt.getOrElse('1');
      assert(some === 'single');
    }
  );
  test.it('Option.map removes undefined from union', function () {
    const a = Option.from('ABC');
    const b: Option<string> = a.map(stringOrUndefinedFn);

    assert(b.getOrElse('Failure') === 'ABC');
  });
  test.it('Option.map can get nested optional value', function () {
    const opt: Option<IA> = Option.from(A3);
    const some: Option<IB> = opt.map((v) => v.a);
    assert(some.getOrElse(B2) === B3);
  });
  test.it('Option.map can get x2 nested optional value', function () {
    const opt: Option<IA> = Option.from(A);
    const some: Option<string> = opt
      .map((v) => v.a)
      .map((v) => v.b)
      .map((v) => v.c);
    assert(some.getOrElse('B') === 'ABC');
  });
  test.it('Option.map returns none for undefined', function () {
    const opt: Option<IA> = Option.from(UndefinedA);
    const none: Option<string> = opt
      .map((v) => v.a)
      .map((v) => v.b)
      .map((v) => v.c);
    assert(none.isNone());
  });
  test.it('Option.map works with undefined', function () {
    const opt: Option<IA> = Option.from(UndefinedA);
    const none: Option<string> = opt
      .map((v) => v.a)
      .map((v) => v.b)
      .map((v) => v.c);
    assert(none.getOrElse('getOrElse') === 'getOrElse');
  });
});
