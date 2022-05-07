import { createWorker, ITypedWorker } from '../src/index';
import { describe, assert } from 'typed-tester';

const setup = (message: 'ok' | 'not ok') => {
  return new Promise(resolve => {
    const tryWorker: ITypedWorker<string, string | Error> = createWorker({
      workerFunction: ({ input, callback }) => {
        try {
          if (input === 'ok') callback('ok');
          throw 'not ok';
        } catch (e) {
          callback(e);
        }
      },
      onMessage: output => {
        resolve(output);
      }
    });
    tryWorker.postMessage(message);
  });
};

describe('try/catch handling', test => {
  test.describe('try/catch - success', () => {
    test.it('returns the correct type', async () => {
      const result = await setup('ok');
      assert(typeof result === 'string');
    });
    test.it('returns the correct value', async () => {
      const result = await setup('ok');
      assert(result === 'ok');
    });
  });

  test.describe('try/catch - failure', () => {
    test.it('returns the correct type', async () => {
      const result = await setup('not ok');
      assert(typeof result === 'string');
    });
    test.it('returns the correct value', async () => {
      const result = await setup('not ok');
      assert(result === 'not ok');
    });
  });
});
