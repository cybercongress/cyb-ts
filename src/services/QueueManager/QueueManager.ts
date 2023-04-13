/* eslint-disable max-classes-per-file */
import {
  BehaviorSubject,
  map,
  timeout,
  throwError,
  of,
  catchError,
  EMPTY,
  Observable,
  mergeMap,
} from 'rxjs';

import * as R from 'ramda';

import { promiseToObservable } from '../../utils/helpers';

import type {
  QueueItem,
  QueueItemResult,
  QueueItemCallback,
  QueueItemOptions,
  QueueStats,
} from './QueueManager.d';

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
        mergeMap((queue) => {
          if (this.executing < this.maxConcurrentExecutions) {
            const filteredQueue = queue
              .filter((i) => i.status === 'pending')
              .sort((a, b) => (b.priority || 0) - (a.priority || 0));

            if (filteredQueue.length) {
              const item = filteredQueue[0];
              const { cid, promiseFactory, callback, controller } = item;
              item.status = 'executing';

              callback(cid, 'executing');
              this.executing++;

              return promiseToObservable(promiseFactory).pipe(
                timeout({
                  each: this.timeout,
                  with: () =>
                    throwError(() => {
                      controller?.abort('timeout');
                      return new QueueItemTimeoutError(this.timeout);
                    }),
                }),
                map(
                  (result): QueueItemResult<T> => ({
                    item,
                    status: 'completed',
                    result,
                  })
                ),
                catchError((error): Observable<QueueItemResult<T>> => {
                  if (error instanceof QueueItemTimeoutError) {
                    return of({
                      item,
                      status: 'timeout',
                    });
                  }
                  if (error.name === 'AbortError') {
                    return of({ item, status: 'cancelled' });
                  }
                  return of({ item, status: 'error' });
                })
              );
            }
          }

          return EMPTY;
        })
      )
      .subscribe(({ item, status, result }) => {
        this.executing--;
        this.removeAndNext(item.cid);
        item.callback(item.cid, status, result);
      });
  }

  private removeAndNext(cid: string): void {
    const updatedQueue = this.queue$.value.filter((i) => i.cid !== cid);
    this.queue$.next(updatedQueue);
  }

  public enqueue(
    cid: string,
    promiseFactory: () => Promise<T>,
    callback: QueueItemCallback<T>,
    options: QueueItemOptions = {}
  ): void {
    const item: QueueItem<T> = {
      cid,
      promiseFactory,
      callback,
      status: 'pending',
      ...options,
    };

    this.queue$.next([...this.queue$.value, item]);
  }

  // private updateStatus(cid: string, status: QueueItemStatus) {
  //   const alterStatus = R.curry((cid, status, items) =>
  //     R.map(R.when(R.propEq('cid', cid), R.assoc('status', status)), items)
  //   );
  //   const updatedQueue = alterStatus(
  //     cid,
  //     status,
  //     this.queue$.value
  //   ) as QueueItem<T>[];

  //   this.queue$.next(updatedQueue);
  // }

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

    this.queue$.value.forEach((item) => {
      // If item parent is different the keep item,
      // If item managed by abortController abort&keep
      // Otherwise just skip it

      if (item.parent !== parent) {
        newQueue.push(item);
      } else if (item.controller) {
        item.controller.abort('cancelled');
        newQueue.push(item);
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

export default QueueManager;
