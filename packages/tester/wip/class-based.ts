import gs from 'glob-stream';

/**
 * Easy to make, but looks a little weird when grouping tests
 */

export async function main() {
  const stream = gs('./**/Option.basic.spec.ts');

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

export function describe(name: string) {
  return new Describe([name]);
}
class Describe {
  parent;
  path;
  constructor(path: string[], parent?: Describe | undefined) {
    this.path = path;
    this.parent = parent;
  }

  describe(innerTestName: string) {
    return new Describe([...this.path, innerTestName], this);
  }

  it(testName: string, callback: () => void) {
    const paths = this.path;
    // console.log(paths);

    paths.forEach((path) => {
      console.group(path);
    });

    // TODO - pass test context + handle exception
    let fail = false;
    try {
      callback();
    } catch (err) {
      fail = true;
    }

    if (fail) {
      console.log('❌', testName);
    } else {
      console.log('✅', testName);
    }

    paths.forEach(() => {
      console.groupEnd();
    });

    return this;
  }
}
