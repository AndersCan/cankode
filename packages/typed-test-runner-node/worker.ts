import { parentPort, MessagePort } from 'node:worker_threads';
import { getEmitter, Events } from 'typed-test-event-bus';

if (parentPort === null) {
  // throw new Error(`worker in non-worker environment`);
  throw new Error(`worker in non-worker environment`);
}
/**
 * This worker will import scripts that contain test code.
 */

const parent: MessagePort = parentPort;
const work: Promise<any>[] = [];
main();
function main() {
  getEmitter().on('*', (eventType, props) => {
    if (props.meta.broadcasted) {
      // this is a broadcasted message -- we do not re-broadcast it
      return;
    }

    const type = props.type;
    const passToParentEvents: Array<keyof Events> = [
      'log',
      'test_file',
      'single_it',
      'block',
      'single_describe',
    ];

    if (passToParentEvents.includes(type)) {
      const newProps = { ...props };
      newProps.meta.broadcasted = true;

      parent.postMessage([eventType, JSON.stringify(newProps)]);
    }
  });

  parent.on('message', ([type, rawProps]: [keyof Events, string]) => {
    // emit messages from parent
    const props = getProps(rawProps);
    getEmitter().emit(type, props);
  });

  getEmitter().on('test_file', async (props) => {
    const path = props.path;
    if (props.status === 'found') {
      try {
        getEmitter().emit('test_file', {
          type: 'test_file',
          status: 'starting',
          path,
          meta: { broadcasted: false },
        });
        const workPromise = import(path);
        work.push(workPromise);
        await workPromise;
        getEmitter().emit('test_file', {
          type: 'test_file',
          status: 'imported',
          path,
          meta: { broadcasted: false },
        });
      } catch (err: any) {
        console.log(err);
        getEmitter().emit('test_file', {
          type: 'test_file',
          status: 'error',
          path,
          meta: { broadcasted: false },
        });
      }
    }
  });

  getEmitter().on('status_change', async (props) => {
    if (props.status === 'done') {
      await Promise.allSettled(work);
      process.exit();
    }
  });
}

function getProps(rawString: string): Events[keyof Events] {
  return JSON.parse(rawString);
}
