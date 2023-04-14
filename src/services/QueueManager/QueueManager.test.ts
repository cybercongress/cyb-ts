import QueueManager from './QueueManager';

function* statusesExpected(resultStatus: string): Generator<string> {
  yield 'executing';
  yield resultStatus;
}

function wrapPromiseWithSignal(
  promise: Promise<string>,
  signal?: AbortSignal
): Promise<string> {
  return new Promise((resolve, reject) => {
    promise.then((result) => {
      resolve(result);
    });

    signal?.addEventListener('abort', (e) => {
      // @ts-ignore
      if (e?.target?.reason !== 'timeout') {
        reject(new DOMException('canceled', 'AbortError'));
      }
    });
  });
}

const getPromise = (
  result = 'result',
  timeout = 500,
  signal?: AbortSignal
): Promise<string> =>
  wrapPromiseWithSignal(
    new Promise<string>((resolve) => {
      setTimeout(() => resolve(`result ${result}`), timeout);
    }),
    signal
  );

describe('QueueManager', () => {
  const maxConcurrentExecutions = 2;
  const timeout = 333;
  let queueManager: QueueManager<string>;

  beforeEach(() => {
    queueManager = new QueueManager<string>(maxConcurrentExecutions, timeout);
  });

  it('should keep in pending items thats is out of maxConcurrentExecutions', () => {
    queueManager.enqueue('1', () => Promise.resolve('42'), jest.fn);
    queueManager.enqueue('2', () => Promise.resolve('42'), jest.fn);
    queueManager.enqueue('3', () => Promise.resolve('42'), jest.fn);
    expect(queueManager.getQueue().pop()?.status).toEqual('pending');
  });

  it('should handle timeout', (done) => {
    const statuses = statusesExpected('timeout');
    const controller = new AbortController();
    const itemId = 'xxx';

    queueManager.enqueue(
      itemId,
      () => getPromise('result', 50000, controller.signal),
      (cid, status) => {
        expect(cid).toBe(itemId);
        expect(status).toBe(statuses.next().value);
      },
      {
        controller,
      }
    );

    setTimeout(() => {
      const queue = queueManager.getQueue();
      expect(queue.length).toBe(0);
      done();
    }, 500);
  });

  it('should cancel queue items', (done) => {
    const statuses = statusesExpected('cancelled');

    const controller = new AbortController();
    const itemId = '1';

    queueManager.enqueue(
      itemId,
      () =>
        wrapPromiseWithSignal(getPromise('result', 50000), controller.signal),
      (cid, status) => {
        expect(cid).toBe(itemId);
        expect(status).toBe(statuses.next().value);
      },
      { controller }
    );
    queueManager.cancel(itemId);

    expect(controller.signal.aborted).toBe(true);

    setTimeout(() => {
      expect(queueManager.getQueue().length).toEqual(0);
      done();
    }, 0);
  });

  it('should handle execution errors', () => {
    const statuses = statusesExpected('error');
    const itemId = '1';
    const promise = Promise.reject(new Error('some error'));

    queueManager.enqueue(
      itemId,
      () => promise,
      (cid, status): void => {
        expect(cid).toBe(itemId);
        expect(status).toBe(statuses.next().value);
      }
    );
    setTimeout(() => {
      const queue = queueManager.getQueue();
      expect(queue.length).toBe(0);
    }, 0);
  });

  it('should execute queue items in order by priority', () => {
    queueManager.enqueue('1', () => getPromise('1', 100), jest.fn);
    queueManager.enqueue('2', () => getPromise('2', 100), jest.fn);

    const executingByPriority: string[] = [];
    queueManager.enqueue(
      '3',
      () => getPromise(),
      (cid, status) => {
        executingByPriority.push(cid);
      },
      { priority: 1 }
    );

    queueManager.enqueue(
      '4',
      () => getPromise(),
      (cid, status) => {
        executingByPriority.push(cid);
      },
      { priority: 10 }
    );

    const queue = queueManager.getQueue();
    expect(queue.length).toBe(4);
    expect(queue[0].status).toBe('executing');
    expect(queue[1].status).toBe('executing');
    expect(queue[3].status).toBe('pending');

    setTimeout(() => {
      const queue = queueManager.getQueue();
      expect(queue.length).toBe(0);
      expect(executingByPriority[0]).toBe('4');
      expect(executingByPriority[1]).toBe('3');
    }, 150);
  });
});
