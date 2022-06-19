import { getEmitter, Events } from 'typed-test-event-bus';
interface IndentMessage {
  indentation: number;
  message: string;
}

const errorMessages: string[] = [];

const outElement = document.querySelector('#out') as HTMLOutputElement;

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
      const indent = indentOf(log.indentation * 4);
      console.log(indent, log.message);
      const pre = document.createElement('pre');
      pre.innerText = `${indent}${log.message}`;
      outElement.appendChild(pre);
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
    msgs.push({
      indentation: data.path.length,
      message: `❌ ${data.testName}`,
    });

    errorMessages.push(`${data.path.join(' -> ')} - ❌ ${data.testName}`);
  }
});

const indentCache = new Map<number, string>();
function indentOf(count: number) {
  return (
    indentCache.get(count) ||
    indentCache.set(count, ''.padStart(count)).get(count)
  );
}
