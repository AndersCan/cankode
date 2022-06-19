import { createWorker, WorkerFunctionProps } from '../src/index';
import { block, assert } from '@cankode/tester';
import * as fc from 'fast-check';

const results: Record<string, Function> = {};

const internalWorker = createWorker({
  workerFunction,
  onMessage: (props) => {
    results[props.id](props.input);
  },
});

const PromiseWorker = <T>(input: T) => {
  const id = Object.keys(results).length;
  internalWorker.postMessage({
    id,
    input,
  });
  return new Promise<typeof input>((resolve) => (results[id] = resolve));
};

block('TypedWorker with state', (test) => {
  test.describe('basic state', (test) => {
    test.it('can save [1, 2, 3]', async () => {
      let input = [1, 2, 3];
      const output = await PromiseWorker(input);
      assert(jsonEqual(output, input));
      assert(output.length === input.length);
      assert(output[0] === input[0]);
      assert(output[1] === input[1]);
      assert(output[2] === input[2]);
    });

    test.it('can save { a: [1, 2, 3] }', async () => {
      let input = { a: [1, 2, 3] };
      const output = await PromiseWorker(input);
      assert(jsonEqual(output, input));
      // assert(typeof output === 'object');
      // assert(output.a instanceof Array);
      // assert(output.a[0] === input[0]);
      // assert(output.a[1] === input[1]);
      // assert(output.a[2] === input[2]);
    });

    test.it('can save anything', () => {
      return fc.assert(
        fc.asyncProperty(fc.anything(), async (anything: any) => {
          let input = anything;
          const output = await PromiseWorker(input);
          assert(jsonEqual(input, output));
        }),
        { numRuns: 10000 }
      );
    });
  });

  test.it('getState and setState have correct types', async () => {
    await new Promise<void>((resolve) => {
      const state = createWorker<number, number, number[]>({
        workerFunction: ({ input, callback, setState, getState }) => {
          setState([input]);
          callback(getState()[0]);
        },
        onMessage: (output) => {
          assert(typeof output === 'number');
          resolve();
        },
      });
      state.postMessage(1);
    });
  });
});

function workerFunction({
  setState,
  getState,
  input,
  callback,
}: WorkerFunctionProps<any, any, any>) {
  setState(input);
  callback(getState());
}

function jsonEqual(a: any, b: any) {
  return JSON.stringify(a) === JSON.stringify(b);
}
