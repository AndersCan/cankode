import { createWorker, ITypedWorker } from '../src/index';
import { block, assert } from '@cankode/tester';

const range = (n: number) => Array.from({ length: n }, (value, key) => key);

block('TypedWorker', (test) => {
  test.describe('basic message passing', (test) => {
    const setup = () => {
      return new Promise<number>((resolve) => {
        const numberWorker: ITypedWorker<number, number> = createWorker({
          workerFunction: ({ input, callback }) => callback(1000),
          onMessage: (output) => {
            resolve(output);
          },
        });
        numberWorker.postMessage(1);
      });
    };

    test.it('returns the correct type', async () => {
      const result = await setup();
      assert(typeof result === 'number');
    });

    test.it('returns the correct value', async () => {
      const result = await setup();
      assert(result === 1000);
    });
  });

  test.describe('simple callback with object', (test) => {
    let objectWorker: ITypedWorker<{ a: number }, { b: number }>;
    const setup = () => {
      return new Promise<any>((resolve) => {
        objectWorker = createWorker({
          workerFunction: ({ input: { a }, callback }) => {
            callback({ b: a });
          },
          onMessage: (output: { b: number }) => {
            resolve(output);
          },
        });
        objectWorker.postMessage({
          a: 10,
        });
      });
    };

    test.it('simple object return', async () => {
      const result = await setup();
      assert(typeof result === 'object');
      assert(typeof result.b === 'number');
      assert(result.b === 10);
    });
  });

  test.describe('multi-messages', (test) => {
    test.describe('small message count', async () => {
      let msgCountDown = 10;

      const numberRangeSmall = range(10);

      const setup = () => {
        let result = 0;
        return new Promise<number>((resolve) => {
          const numberWorker: ITypedWorker<number, number> = createWorker({
            workerFunction: ({ input, callback }) => callback(input),
            onMessage: (output) => {
              result += output;
              msgCountDown--;
              if (msgCountDown === 0) {
                resolve(result);
              }
            },
          });
          numberRangeSmall.forEach((n) => numberWorker.postMessage(n));
        });
      };

      test.it(
        'returns correct result after adding numberRangeSmall',
        async () => {
          const result = await setup();
          const expected = numberRangeSmall.reduce((c, p) => c + p);
          assert(result === expected);
        }
      );
    });

    test.describe('large message count', (test) => {
      const numberRangeLarge = range(10000);

      let msgCountDown = numberRangeLarge.length;

      const setup = () => {
        let result = 0;
        return new Promise<number>((resolve) => {
          const numberWorker: ITypedWorker<number, number> = createWorker({
            workerFunction: ({ input, callback }) => callback(input),
            onMessage: (output) => {
              result += output;
              msgCountDown--;
              if (msgCountDown === 0) {
                resolve(result);
              }
            },
          });
          numberRangeLarge.forEach((n) => numberWorker.postMessage(n));
        });
      };

      test.it(
        'returns correct result after adding numberRangeLarge',
        async () => {
          const result = await setup();
          const expected = numberRangeLarge.reduce((c, p) => c + p);
          assert(result === expected);
        }
      );
    });
    test.describe('correct order', (test) => {
      const setup = () => {
        let result: number[] = [];
        return new Promise<number[]>((resolve) => {
          const multiReponse: ITypedWorker<number, number> = createWorker({
            workerFunction: ({ input, callback }) => {
              callback(input);
            },
            onMessage: (output: number) => {
              result.push(output);
              if (output === 3) {
                resolve(result);
              }
            },
          });
          multiReponse.postMessage(1);
          multiReponse.postMessage(2);
          multiReponse.postMessage(3);
        });
      };

      test.it('correct length', async () => {
        const result = await setup();
        assert(result.length === 3);
      });

      test.it('order is correct', async () => {
        const result = await setup();
        assert(result.length === 3);
        assert(result[0] === 1);
        assert(result[1] === 2);
        assert(result[2] === 3);
      });
    });
  });

  test.describe('handles large input', async () => {
    let result: number;
    const setup = () => {
      return new Promise<number>((resolve) => {
        const numberWorker: ITypedWorker<number[], number[]> = createWorker({
          workerFunction: ({ input, callback }) => callback(input),
          onMessage: (output) => {
            result = output.reduce((c, p) => c + p);
            resolve(result);
          },
        });
        numberWorker.postMessage(range(1000));
      });
    };

    test.it('returns the correct value', async () => {
      const result = await setup();
      const expected = range(1000).reduce((c, p) => c + p);
      assert(result === expected);
    });
  });

  test.describe('Termination', (test) => {
    let msgCounter = 0;
    let numberWorker: ITypedWorker<number, number>;
    numberWorker = createWorker({
      workerFunction: () => {
        msgCounter += 1;
      },
    });

    test.it('stops handling messages', async () => {
      numberWorker.terminate();
      numberWorker.postMessage(1);
      assert(msgCounter === 0);
    });
  });

  test.describe('Termination', (test) => {
    let msgCounter = 0;
    let numberWorker: ITypedWorker<number, number>;
    const setup = () => {
      return new Promise<number>((resolve) => {
        numberWorker = createWorker({
          workerFunction: ({ input, callback }) => {
            callback(input);
          },
          onMessage: (output) => {
            numberWorker.terminate();
            msgCounter = output;
            setTimeout(() => resolve(msgCounter), 500);
          },
        });
        numberWorker.postMessage(1);
        numberWorker.postMessage(2);
      });
    };

    test.it('stops handling messages', async () => {
      const result = await setup();
      assert(result === 1);
    });
  });
});
