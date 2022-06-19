import gs from 'glob-stream';
import os from 'os';

import { getEmitter, Events } from '@cankode/test-event-bus';

import { WorkerPool } from './worker-pool';

const coreNumber = os.cpus().length;

const workerPool = new WorkerPool(coreNumber);

getEmitter().on('*', (eventType, props) => {
  if (props.meta.broadcasted) {
    return;
  }
  const passToWorkerEvents: Array<keyof Events> = [
    'test_file',
    'status_change',
  ];
  if (passToWorkerEvents.includes(eventType)) {
    const message = [eventType, JSON.stringify(props)];
    if (eventType === 'status_change') {
      // pass to all workers in pool
      workerPool.postMessageToAll(message);
      return;
    }
    workerPool.postMessage(message);
  }
});

getEmitter().on('test_file', (data) => {
  if (data.status === 'imported') {
    mapofwork.set(data.path, { status: 'IMPORTED' });
  }
});

interface IndentMessage {
  indentation: number;
  message: string;
}

const errorMessages: string[] = [];

getEmitter().on('single_it', (data) => {
  const [blockId] = data.path;
  const msgs = indentMessageMap.get(blockId);

  if (!msgs) {
    throw new Error(`${blockId} - missing msgs`);
  }
  if (data.status === 'success') {
    msgs.push({
      indentation: data.path.length,
      message: `✅ ${data.testName} (${data.time}ms)`,
    });
  } else {
    process.exitCode = 1;
    msgs.push({
      indentation: data.path.length,
      message: `❌ ${data.testName}`,
    });

    errorMessages.push(`${data.path.join(' -> ')} - ❌ ${data.testName}`);
  }
});

process.once('beforeExit', () => {
  if (errorMessages.length === 0) return;

  console.log('ERRORS');
  for (const log of errorMessages) {
    console.log(log);
  }
});

getEmitter().on('log', (data) => {
  console.log(data.message);
});

const indentMessageMap = new Map<string, IndentMessage[]>();
getEmitter().on('block', (data) => {
  if (data.status === 'starting') {
    indentMessageMap.set(data.blockId, [
      {
        indentation: 0,
        message: data.blockId,
      },
    ]);
  } else {
    const messages = indentMessageMap.get(data.blockId);
    if (!messages) {
      throw new Error(`${data.blockId} is missing starting status`);
    }
    for (const log of messages) {
      console.log(indentOf(log.indentation * 4), log.message);
    }
  }
});

getEmitter().on('single_describe', (data) => {
  if (data.status === 'start') {
    const messages = indentMessageMap.get(data.blockId);
    if (!messages) {
      throw new Error(`${data.blockId} is missing starting status`);
    }

    messages.push({
      indentation: data.path.length,
      message: data.describeId,
    });
  }
});

interface Found {
  status: 'FOUND';
}
interface Done {
  status: 'IMPORTED';
}
type TestStatus = Found | Done;
const mapofwork = new Map<string, TestStatus>();

export async function runTests(globPattern: string | string[]) {
  const stream = gs(globPattern);

  for await (const file of stream) {
    const entry = getEntry_UNSAFE(file);

    const path = entry.path;

    // keep track of ongoing work
    mapofwork.set(path, { status: 'FOUND' });

    getEmitter().emit('test_file', {
      type: 'test_file',
      status: 'found',
      path,
      meta: { broadcasted: false },
    });
  }

  getEmitter().emit('status_change', {
    type: 'status_change',
    status: 'done',
    meta: { broadcasted: false },
  });
}

function getEntry_UNSAFE(whatever: any): gs.Entry {
  return whatever;
}

const indentCache = new Map<number, string>();
function indentOf(count: number) {
  return (
    indentCache.get(count) ||
    indentCache.set(count, ''.padStart(count)).get(count)
  );
}
