import { createWorker, ITypedWorker } from '../src/index';
import { describe, assert } from 'typed-tester';

const setup = () => {
  return new Promise<{
    workerContextBytelength: number;
    uiContextByteLength: number;
  }>(resolve => {
    let uiContextByteLength = 0;

    const transferWorker: ITypedWorker<ArrayBuffer, number> = createWorker({
      workerFunction: ({ input, callback }) => callback(input.byteLength),
      onMessage: workerContextBytelength => {
        resolve({
          workerContextBytelength,
          uiContextByteLength
        });
      }
    });

    const myUInt8Array = new Uint8Array(1024 * 1024 * 8); // 8MB
    for (let i = 0; i < myUInt8Array.length; ++i) {
      myUInt8Array[i] = i;
    }
    uiContextByteLength = myUInt8Array.byteLength;
    transferWorker.postMessage(myUInt8Array.buffer, [myUInt8Array.buffer]);
    uiContextByteLength = myUInt8Array.byteLength;
  });
};

const setupWorker2UI = () => {
  return new Promise<{
    uiContextByteLength: number;
  }>(resolve => {
    let uiContextByteLength = 0;

    const transferWorker: ITypedWorker<any, ArrayBuffer> = createWorker({
      workerFunction: ({ input, callback }) => {
        const myUInt8Array = new Uint8Array(1024 * 1024 * 8); // 8MB
        for (let i = 0; i < myUInt8Array.length; ++i) {
          myUInt8Array[i] = i;
        }
        callback(myUInt8Array.buffer, [myUInt8Array.buffer]);
        // assert(
        //   myUInt8Array.length === 0,
        //   'array transfered away from Worker to UI'
        // );
      },
      onMessage: buffer => {
        resolve({
          uiContextByteLength: buffer.byteLength
        });
      }
    });
    transferWorker.postMessage(0);
  });
};

describe('TypedWorker - transfer', test => {
  test.describe('can transfer ownership from UI to worker', test => {
    test.it('UI context byteLength should be zero', async () => {
      const result = await setup();
      assert(result.uiContextByteLength === 0);
    });

    test.it(
      'Worker context byteLength should be greater than zero',
      async () => {
        const result = await setup();
        assert(result.workerContextBytelength > 0);
      }
    );
  });

  test.describe('can transfer ownership from worker to ui', () => {
    test.it('UI context byteLength should be greater than zero', async () => {
      const result = await setupWorker2UI();
      assert(result.uiContextByteLength > 0);
    });
  });
});
