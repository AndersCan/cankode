import mitt from 'mitt';

export type Events = {
  error: {
    type: 'error';
    error: Error;
  } & Meta;

  test_file: {
    type: 'test_file';
    status: 'found' | 'starting' | 'imported' | 'error';
    path: string;
  } & Meta;

  single_it: {
    type: 'single_it';
    status: 'success' | 'fail';
    path: string[];
    testName: string;
    time: number;
  } & Meta;

  single_describe: {
    type: 'single_describe';
    status: 'start' | 'done';
    path: string[];
    describeId: string;
    blockId: string;
  } & Meta;

  block: {
    type: 'block';
    status: 'starting' | 'done';
    blockId: string;
  } & Meta;

  status_change: {
    type: 'status_change';
    status: 'searching' | 'done';
  } & Meta;

  log: {
    type: 'log';
    message: string;
  } & Meta;
};
interface Meta {
  meta: {
    broadcasted: boolean;
  };
}

const emitter = mitt<Events>();

/**
 * Shared event emitter to listen and emit messages to "everything"
 * @returns a singleton emitter for the current process
 */
export function getEmitter() {
  return emitter;
}

// export function getEmitterx<Events extends Record<EventType, unknown>>() {
//   return emitter as any as Emitter<Events>;
// }
