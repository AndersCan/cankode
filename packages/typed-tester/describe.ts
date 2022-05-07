import gs from 'glob-stream';

let somethingHasFailed = 0;
const ERRORS: string[] = [];
/**
 * Easy to make, but looks a little weird when grouping tests
 */

process.addListener('beforeExit', () => {
  if (ERRORS.length === 0) {
    return;
  }
  console.error(ERRORS);
});

export async function runTests(globPattern: string | string[]) {
  const stream = gs(globPattern);

  for await (const file of stream) {
    const entry = getEntry_UNSAFE(file);

    const path = entry.path;
    // TODO: Emit test file has been found and let something else run it
    const module = await import(path);
  }
}
function getEntry_UNSAFE(whatever: any): gs.Entry {
  return whatever;
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

  it(testName: string, callback: () => void) {
    // TODO - pass test context + handle exception
    try {
      callback();
      console.log('✅', testName);
    } catch (err: any) {
      if (process) {
        process.exitCode = 1;
      }
      const lineError = err.stack.split(/\n/)[2];
      const errorMessage = `❌ ${testName} ${lineError}`;
      console.log(errorMessage);
      ERRORS.push(errorMessage);
    }

    return this;
  }
}

// const map = new Map<string[], ((d: Describe) => void)[]>();
