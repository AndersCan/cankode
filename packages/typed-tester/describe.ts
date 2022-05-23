import { getEmitter } from 'typed-test-event-bus';
/**
 * Easy to make, but looks a little awkward in use, but:
 * 1. Easy to write
 * 2. Easy to follow execution
 * 3. Clearly defined when a test will be run (ie `test.it`)
 * 4. Clearly defined when a test describe/block/group is created (ie `test.describe`)
 */

export function block(name: string, callback: (d: Describe) => void) {
  const blockId = `${name}`;
  getEmitter().emit('block', {
    type: 'block',
    status: 'starting',
    blockId,
    meta: { broadcasted: false },
  });

  callback(new Describe([name]));

  getEmitter().emit('block', {
    type: 'block',
    status: 'done',
    blockId,
    meta: { broadcasted: false },
  });
}
class Describe {
  parent;
  path;
  constructor(path: string[], parent?: Describe | undefined) {
    this.path = path;
    this.parent = parent;
  }

  describe(innerTestName: string, callback: (hmm: Describe) => void) {
    getEmitter().emit('single_describe', {
      type: 'single_describe',
      status: 'start',
      path: this.path,
      describeId: innerTestName,
      blockId: this.path[0],
      meta: {
        broadcasted: false,
      },
    });

    callback(new Describe([...this.path, innerTestName], this));

    getEmitter().emit('single_describe', {
      type: 'single_describe',
      status: 'done',
      path: this.path,
      describeId: innerTestName,
      blockId: this.path[0],
      meta: {
        broadcasted: false,
      },
    });
  }

  it(testName: string, callback: () => void) {
    // TODO - pass/create test context
    const now = Date.now();
    try {
      callback();
      const done = Date.now() - now;
      getEmitter().emit('single_it', {
        type: 'single_it',
        status: 'success',
        path: this.path,
        testName: testName,
        time: done,
        meta: {
          broadcasted: false,
        },
      });
    } catch (err: unknown) {
      const done = Date.now() - now;
      let errorMessage = `❌ ${testName}`;

      if (err instanceof Error && err.stack) {
        const lineError = err.stack.split(/\n/)[2];
        errorMessage = `❌ ${testName} ${lineError}`;
      }
      getEmitter().emit('single_it', {
        type: 'single_it',
        status: 'fail',
        path: this.path,
        testName: testName,
        time: done,
        meta: {
          broadcasted: false,
        },
      });
    }
  }
}
