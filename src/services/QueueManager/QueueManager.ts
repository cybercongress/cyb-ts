/* eslint-disable max-classes-per-file */
import {
  BehaviorSubject,
  map,
  timeout,
  throwError,
  // distinctUntilChanged,
} from 'rxjs';
import { promiseToObservable } from 'src/utils/helpers';

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

type QueueItemOptions = {
  controller?: AbortController;
  parent?: string;
  priority?: number;
};

type QueueItem<T> = {
  cid: string;
  promiseFactory: () => Promise<Nullable<T>>;
  status: QueueItemStatus;
  callback: QueueItemCallback<T>;
} & QueueItemOptions;

class QueueItemTimeoutError extends Error {
  constructor(timeoutMs: number) {
    super(`Timeout after ${timeoutMs}`);
    Object.setPrototypeOf(this, QueueItemTimeoutError.prototype);
  }
}

class QueueManager<T> {
  private queue$ = new BehaviorSubject<QueueItem<T>[]>([]);

  private executing = 0;

  private maxConcurrentExecutions: number;

  private timeout: number;

  constructor(maxConcurrentExecutions: number, timeoutMs: number) {
    this.maxConcurrentExecutions = maxConcurrentExecutions;
    this.timeout = timeoutMs;
    this.queue$
      .pipe(
        // distinctUntilChanged()
        map((queue) => {
          if (this.executing < this.maxConcurrentExecutions) {
            return queue
              .filter((i) => i.status === 'pending')
              .sort((a, b) => (b.priority || 0) - (a.priority || 0));
          }

          return [] as QueueItem<T>[];
        })
      )
      .subscribe((queue) => {
        if (queue.length) {
          const item = queue[0];
          const { cid, promiseFactory, callback, controller } = item;
          item.status = 'executing';
          // console.log('------item!', item, item.priority, this.getStats());

          item.callback(cid, 'executing');
          this.executing++;

          promiseToObservable(promiseFactory)
            .pipe(
              timeout({
                each: this.timeout,
                with: () =>
                  throwError(() => {
                    controller?.abort('timeout');
                    return new QueueItemTimeoutError(this.timeout);
                  }),
              })
            )
            .subscribe({
              next: (result) => callback(cid, 'completed', result),
              error: (error) => {
                if (error instanceof QueueItemTimeoutError) {
                  callback(cid, 'timeout');
                } else if (error.name === 'AbortError') {
                  callback(cid, 'cancelled');
                } else {
                  callback(cid, 'error');
                }
              },
            })
            .add(() => {
              this.executing--;
              this.remove(item);
            });
        }
      });
  }

  private remove(item: QueueItem<T>): void {
    const updatedQueue = this.queue$.value.filter((i) => i.cid !== item.cid);
    this.queue$.next(updatedQueue);
  }

  public enqueue(
    cid: string,
    promiseFactory: () => Promise<T>,
    callback: QueueItemCallback<T>,
    options: QueueItemOptions = {}
  ): void {
    const { controller, parent, priority } = options;
    const item: QueueItem<T> = {
      cid,
      promiseFactory,
      status: 'pending',
      callback,
      controller,
      parent,
      priority,
    };

    this.queue$.next([...this.queue$.value, item]);
  }

  private updateStatus(cid: string, status: QueueItemStatus) {
    const alterStatus = R.curry((cid, status, items) =>
      R.map(R.when(R.propEq('cid', cid), R.assoc('status', status)), items)
    );
    const updatedQueue = alterStatus(
      cid,
      status,
      this.queue$.value
    ) as QueueItem<T>[];

    this.queue$.next(updatedQueue);
  }

  public cancel(cid: string): void {
    const currentQueue = this.queue$.value;
    const item = currentQueue.find((item) => item.cid === cid);
    if (item) {
      // If item has no abortController we can just remove it
      // Otherwise abort should be handled by subscriber

      if (!item.controller) {
        this.queue$.next(currentQueue.filter((item) => item.cid !== cid));
      } else {
        item.controller.abort('cancelled');
      }
    }
  }

  public cancelByParent(parent: string): void {
    const newQueue: QueueItem<T>[] = [];

    this.queue$.value.forEach((i) => {
      // If item parent is different the keep item,
      // If item managed by abortController abort&keep
      // Otherwise just skip it

      if (i.parent !== parent) {
        newQueue.push(i);
      } else if (i.controller) {
        i.controller.abort();
        newQueue.push(i);
      }
    });

    this.queue$.next(newQueue);
  }

  public getQueue(): QueueItem<T>[] {
    return this.queue$.value;
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

export type { QueueItemStatus };
