import { Worker, TransferListItem } from 'node:worker_threads';
import { getEmitter, Events } from 'typed-test-event-bus';

export class WorkerPool {
  currentIndex;
  workers;
  size;
  constructor(size: number) {
    this.size = size;
    this.currentIndex = 0;
    this.workers = [] as Worker[];

    const path = new URL('./worker.js', import.meta.url).pathname;

    for (let i = 0; i < size; i++) {
      const worker = new Worker(path);

      worker.on('error', (e) => {
        throw e;
      });

      worker.on('message', ([type, props]) => {
        const parsed = getProps(props);
        parsed.meta = {
          ...parsed.meta,
          broadcasted: true,
        };
        getEmitter().emit(type, parsed);
      });

      this.workers.push(worker);
    }
  }

  postMessage(value: any, transferList?: ReadonlyArray<TransferListItem>) {
    this.currentIndex = (this.currentIndex + 1) % this.size;
    this.workers[this.currentIndex].postMessage(value, transferList);
  }

  postMessageToAll(value: any) {
    for (let i = 0; i < this.size; i++) {
      this.workers[i].postMessage(value);
    }
  }
}

function getProps(rawString: string): Events[keyof Events] {
  return JSON.parse(rawString);
}
