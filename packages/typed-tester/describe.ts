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

export function describe(name: string, callback: (d: Describe) => void) {
  console.group(name);
  callback(new Describe([name]));
  console.groupEnd();
}
class Describe {
  parent;
  path;
  constructor(path: string[], parent?: Describe | undefined) {
    this.path = path;
    this.parent = parent;
  }

  describe(innerTestName: string, callback: (hmm: Describe) => void) {
    console.group(innerTestName);
    callback(new Describe([...this.path, innerTestName], this));
    console.groupEnd();
  }

  async it(testName: string, callback: () => void): Promise<void> {
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
  }
}

// const map = new Map<string[], ((d: Describe) => void)[]>();
