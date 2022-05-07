import PQueue from 'p-queue';

const queue = new PQueue({ concurrency: 1 });

const ERRORS: string[] = [];
/**
 * Easy to make, but looks a little awkward in use, but:
 * 1. Easy to write
 * 2. Easy to follow execution
 * 3. Clearly defined when a test will be run (ie `test.it`)
 * 4. Clearly defined when a test describe/block/group is created (ie `test.describe`)
 */
if (typeof process === 'object') {
  process.addListener('beforeExit', () => {
    if (ERRORS.length === 0) {
      return;
    }
    console.error(ERRORS);
  });
}

export async function describe(name: string, callback: (d: Describe) => void) {
  await queue.onIdle();
  console.group(name);
  callback(new Describe([name]));
  console.groupEnd();
}
class Describe {
  parent;
  path;
  beforeEachCallbacks: Function[];
  constructor(path: string[], parent?: Describe | undefined) {
    this.path = path;
    this.parent = parent;
    this.beforeEachCallbacks = [];
  }

  // hooks
  beforeEach(callback: () => Promise<any> | void) {
    this.beforeEachCallbacks.push(callback);
  }

  async describe(innerTestName: string, callback: (hmm: Describe) => void) {
    await queue.onIdle();
    console.group(innerTestName);
    callback(new Describe([...this.path, innerTestName], this));
    console.groupEnd();
  }

  async it(testName: string, callback: () => void): Promise<void> {
    await queue.onIdle();
    // todo: wait for previous `it` run to be done
    return queue.add(async () => {
      // run beforeEach callback
      for (const beforeEach of this.beforeEachCallbacks) {
        await beforeEach();
      }

      // TODO - pass test context + handle exception
      try {
        callback();
        console.log('✅', testName);
      } catch (err) {
        if (typeof process === 'object') {
          process.exitCode = 1;
        }
        //@ts-expect-error -- `err: any` getting formated away
        const lineError = err.stack.split(/\n/)[2];
        const errorMessage = `❌ ${testName} ${lineError}`;
        console.log(errorMessage);
        ERRORS.push(errorMessage);
      }
    });
  }
}

// const map = new Map<string[], ((d: Describe) => void)[]>();
