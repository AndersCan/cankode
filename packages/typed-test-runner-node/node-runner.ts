import gs from 'glob-stream';

export async function runTests(globPattern: string | string[]) {
  const stream = gs(globPattern);

  for await (const file of stream) {
    const entry = getEntry_UNSAFE(file);

    const path = entry.path;
    // TODO: Just emit the test file path
    // let something else run it
    import(path);
  }
}

function getEntry_UNSAFE(whatever: any): gs.Entry {
  return whatever;
}
