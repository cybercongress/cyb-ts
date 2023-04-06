import { BehaviorSubject, map, filter, mergeMap } from 'rxjs';
import * as R from 'ramda';

import { Nullable } from '../../types';

type QueueItemStatus =
  | 'pending'
  | 'executing'
  | 'timeout'
  | 'completed'
  | 'cancelled'
  | 'error';

type QueueStats = {
  status: QueueItemStatus;
  count: number;
};

type QueueItemCallback<T> = (
  cid: string,
  status: QueueItemStatus,
  result?: Nullable<T>
) => void;

type QueueItem<T> = {
  cid: string;
  promise: () => Promise<Nullable<T>>;
  status: QueueItemStatus;
  callback: QueueItemCallback<T>;
  controller?: AbortController;
  parent?: string;
  priority?: number;
};

async function withTimeout<T>(
  promise: Promise<T>,
  timeout: number,
  abortController?: AbortController
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      const timer = setTimeout(() => {
        abortController?.abort('timeout');
        clearTimeout(timer);
        reject(new DOMException('timeout', 'AbortError'));
      }, timeout);
    }),
  ]);
}
class QueueManager<T> {
  private queue$ = new BehaviorSubject<QueueItem<T>[]>([]);

  private executing = 0;

  private maxConcurrentExecutions: number;

  private timeout: number;

  constructor(maxConcurrentExecutions: number, timeout: number) {
    this.maxConcurrentExecutions = maxConcurrentExecutions;
    this.timeout = timeout;
    this.queue$
      .pipe(
        map((items) =>
          items
            .filter((p) => p.status === 'pending')
            .sort((a, b) => (b.priority || 0) - (a.priority || 0))
        ),
        filter((queue) => {
          return (
            this.executing < this.maxConcurrentExecutions && queue?.length > 0
          );
        })
        // mergeMap((queue) => {
        //   const item = queue[0];
        //   if (item) {
        //     console.log('----exec', this.executing, queue.length, item.cid);
        //     item.status = 'executing';
        //     this.executing++;
        //     item.callback(item.cid, item.status);
        //   }
        //   return queue;
        // })
      )
      .subscribe((queue) => {
        const item = queue[0];
        if (item) {
          item.status = 'executing';
          this.executing++;
          item.callback(item.cid, item.status);

          const { cid, promise, callback, controller } = item;

          // const timeoutId = setTimeout(() => {
          //   controller?.abort();
          //   console.log('----timeout', cid);
          //   callback(cid, 'timeout');
          // }, this.timeout);

          promise()
            .then((result) => {
              callback(cid, 'completed', result);
            })
            .catch((error) => {
              if (error.name === 'AbortError') {
                callback(
                  cid,
                  error.message === 'timeout' ? 'timeout' : 'cancelled'
                );
              } else {
                callback(cid, 'error');
              }
            })
            .finally(() => {
              this.executing--;
              this.next();
              // clearTimeout(timeoutId);
            });
        }
      });
  }

  private next(): void {
    if (this.executing < this.maxConcurrentExecutions) {
      const [item, ...rest] = this.queue$.value;
      if (item) {
        this.queue$.next(rest);
      }
    }
  }

  public enqueue(
    cid: string,
    promise: () => Promise<T>,
    callback: QueueItemCallback<T>,
    controller?: AbortController,
    parent?: string,
    priority?: number
  ): void {
    const item: QueueItem<T> = {
      cid,
      promise: () => withTimeout(promise(), this.timeout, controller),
      status: 'pending',
      callback,
      controller,
      parent,
      priority,
    };
    const currentQueue = this.queue$.value;
    this.queue$.next([...currentQueue, item]);
  }

  public cancel(cid: string): void {
    const currentQueue = this.queue$.value;
    const item = currentQueue.find((item) => item.cid === cid);
    if (item) {
      item.controller?.abort('cancelled');
      // item.callback(cid, item.status);
      const updatedQueue = currentQueue.filter((item) => item.cid !== cid);
      this.queue$.next(updatedQueue);
    }
  }

  public getQueue(): QueueItem<T>[] {
    return this.queue$.value;
  }

  public cancelByParent(parent: string): void {
    const currentQueue = [...this.queue$.value].filter(
      (i) => i.parent === parent
    );
    currentQueue.map((i) => this.cancel(i.cid));
  }

  public getStats(): QueueStats[] {
    const fn = R.pipe(
      R.countBy<QueueItem<T>>(R.prop('status')),
      R.toPairs,
      R.map(R.zipObj(['status', 'count']))
    );

    return fn(this.queue$.value) as QueueStats[];
  }
}

export { QueueManager };

export type { QueueItemCallback, QueueItemStatus };
