import { createWorker, ICreateWorkerProps } from '../../src/index';
import { block, assert } from 'typed-tester';

declare const moment: any;

const setup = () => {
  return new Promise((resolve) => {
    const workerMomentProps: ICreateWorkerProps<number, string> = {
      workerFunction: ({ input, callback }) => {
        callback(moment(input).format('YYYY'));
      },
      importScripts: ['https://unpkg.com/moment@2.22.2/min/moment.min.js'],
    };
    const momentWorker = createWorker({
      ...workerMomentProps,
      onMessage: (result) => {
        resolve(result);
      },
    });
    momentWorker.postMessage(0);
  });
};

block('importScript', (test) => {
  test.describe('can import script', (test) => {
    test.it('returns the correct type', async () => {
      const result = await setup();
      assert(typeof result === 'string');
    });

    test.it('returns the correct value', async () => {
      const result = await setup();
      assert(result === '1970');
    });
  });

  test.describe('calls onError when given bad import', () => {
    let result: string;
    const badImportURI = 'https://unpkg.com/something.that.gives.error.js';
    const invalidImportProps: ICreateWorkerProps<string, string> = {
      workerFunction: ({ input, callback }) => {
        callback(input);
      },
      importScripts: [badImportURI],
    };

    const errorMessage = 'error called';

    const setup = () => {
      return new Promise((resolve) => {
        result = '';
        const badImportWorker = createWorker({
          ...invalidImportProps,
          onMessage: (res) => {
            throw 'should not be called';
          },
          onError: (err) => {
            err.preventDefault();
            resolve(errorMessage);
          },
        });

        badImportWorker.postMessage('fails');
      });
    };

    test.it('calls onError', async () => {
      const result = await setup();
      assert(result === errorMessage);
    });
  });

  test.describe('can import script in worker function', () => {
    const workerMomentProps: ICreateWorkerProps<number, string> = {
      workerFunction: ({ input, callback }) => {
        if (self['moment'] === undefined) {
          importScripts('https://unpkg.com/moment@2.22.2/min/moment.min.js');
        }
        callback(moment(input).format('YYYY'));
      },
    };

    const setup = () => {
      return new Promise((resolve) => {
        const momentWorker = createWorker({
          ...workerMomentProps,
          onMessage: (result) => {
            resolve(result);
          },
        });
        momentWorker.postMessage(0);
      });
    };

    test.it('returns the correct type', async () => {
      const result = await setup();
      assert(typeof result === 'string');
      assert(result === '1970');
    });
  });
});
