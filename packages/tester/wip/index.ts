import gs from 'glob-stream';

export async function main() {
  const stream = gs('./**/Option.basic.spec.ts');

  for await (const file of stream) {
    const entry = getEntry_UNSAFE(file);

    const path = entry.path;
    // TODO: Emit test file has been found and let something else run it
    console.log('START');
    const module = await import(path);
    // :-|
    console.groupEnd();
    console.groupEnd();
    console.groupEnd();
    console.log('STOP');
  }
}
function getEntry_UNSAFE(whatever: any): gs.Entry {
  return whatever;
}
type Callback = (innerDescribe: typeof describe) => void;
interface IContext {
  path: string[];
}

export function describe(
  this: IContext | void,
  name: string,
  callback: Callback
) {
  const context: IContext = this || { path: [name] };
  console.group(name);
  if (this) {
    context.path = [...context.path, name];
  }
  console.log('context for', name, 'is', context.path);
  callback(describe.bind(context));
}
