/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { QueueManager } from './QueueManager';
import searchResponse from './stub/searchResponse.json';

const queue = new QueueManager(3, 500);

const resultAll: Record<string, any> = {};

function sleep(ms: number): Promise<unknown> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
const printStack = (): void => {
  console.log(
    'QUEUE: ',
    queue
      .getStats()
      .map((i) => `${i.status}: ${i.count}`)
      .join(' | ')
  );
};

function until(conditionFunction: () => boolean): Promise<unknown> {
  const poll = (resolve) => {
    if (conditionFunction()) {
      resolve();
    } else {
      setTimeout((_) => poll(resolve), 400);
    }
  };

  return new Promise(poll);
}

const doEnqueue = (cid: string): void => {
  const controller = new AbortController();
  const { signal } = controller;

  queue.enqueue(
    cid,
    async () => {
      return fetch(`https://ipfs.io/ipfs/${cid}`, { signal });
      // .catch((err) => {
      //   console.log('----errcacth', err);
      //   return Promise.reject(new DOMException('canceled', 'AbortError'));
      // });
    },
    (id, status, result) => {
      resultAll[id] = { status };
      console.log(`callback ${id}(${status}):`);
    },
    {
      controller,
    }
  );
};
Object.values(searchResponse).forEach((i) => doEnqueue(i.particle));

queue.cancel(Object.values(searchResponse)[9].particle);
queue.cancel(Object.values(searchResponse)[3].particle);
async function demo() {
  // sleep(1000);
  // printStack();
  await until(() => queue.getQueue().length === 0);
  console.log('RESULTS', resultAll);
}

demo();
