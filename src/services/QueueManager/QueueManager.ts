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
  debounceTime,
  concat,
  concatMap,
  tap,
} from 'rxjs';

import * as R from 'ramda';

import { fetchIpfsContent } from 'src/utils/ipfs/utils-ipfs';
import { AppIPFS } from 'src/utils/ipfs/ipfs';

import { promiseToObservable } from '../../utils/helpers';

import type {
  QueueItem,
  QueueItemResult,
  QueueItemCallback,
  QueueItemOptions,
  QueueStats,
  QueueSource,
} from './QueueManager.d';

import { QueueStrategy } from './QueueStrategy';

import { QueueItemTimeoutError } from './QueueItemTimeoutError';

const QUEUE_DEBOUNCE_MS = 33;

function getQueueItemGeneralPriority<T>(item: QueueItem<T>): number {
  return (item.priority || 0) + (item.viewPortPriority || 0);
}

const alterQueueItemViewPortPriority = R.curry((cid, status, items) =>
  R.map(
    R.when(R.propEq('cid', cid), R.assoc('viewPortPriority', status)),
    items
  )
);

const strategies = {
  external: new QueueStrategy(
    {
      db: { timeout: 5000, maxConcurrentExecutions: 999 },
      node: { timeout: 60 * 1000, maxConcurrentExecutions: 21 },
      gateway: { timeout: 21000, maxConcurrentExecutions: 11 },
    },
    ['db', 'node', 'gateway']
  ),
  embedded: new QueueStrategy(
    {
      db: { timeout: 5000, maxConcurrentExecutions: 999 },
      gateway: { timeout: 21000, maxConcurrentExecutions: 11 },
      node: { timeout: 60 * 1000, maxConcurrentExecutions: 21 },
    },
    ['db', 'gateway', 'node']
  ),
};

type QueueMap<T> = Map<string, QueueItem<T>>;

class QueueManager<T> {
  private queue$ = new BehaviorSubject<QueueMap<T>>(new Map());

  private node: AppIPFS | undefined = undefined;

  private strategy: QueueStrategy;

  private queueDebounceMs: number;

  private executing: Record<QueueSource, number> = {
    db: 0,
    node: 0,
    gateway: 0,
  };

  private switchStrategy(strategy: QueueStrategy): void {
    this.strategy = strategy;
  }

  public setNode(node: AppIPFS) {
    console.log(`switch node from ${this.node?.nodeType} to ${node.nodeType}`);

    this.node = node;
    this.switchStrategy(strategies[node.nodeType]);
  }

  private getItemBySourceAndPriority(queue: QueueMap<T>) {
    const pendingItems = [...queue.values()].filter(
      (i) => i.status === 'pending'
    );

    const pendingBySource = R.groupBy((i) => i.source, pendingItems);

    // eslint-disable-next-line no-restricted-syntax
    const itemsToExecute: QueueItem<T>[] = [];
    // eslint-disable-next-line no-loop-func, no-restricted-syntax
    for (const [queueSource, items] of Object.entries(pendingBySource)) {
      const settings = this.strategy.settings[queueSource];

      const executeCount =
        settings.maxConcurrentExecutions - this.executing[queueSource];
      const itemsByPriority = items
        .sort(
          (a, b) =>
            getQueueItemGeneralPriority(b) - getQueueItemGeneralPriority(a)
        )
        .slice(0, executeCount);
      // console.log('-----pick', this.executing);
      itemsToExecute.push(...itemsByPriority);
    }

    return itemsToExecute;
  }

  private fetchData$(item: QueueItem<T>) {
    const { cid, source, controller, callback } = item;
    const settings = this.strategy.settings[source];
    // console.log('---fetchData', cid, source, this.strategy);
    this.executing[source]++;

    const queueItem = this.queue$.value.get(cid);
    // Mutate item without next
    this.queue$.value.set(cid, {
      ...queueItem,
      status: 'executing',
      executionTime: Date.now(),
      controller: new AbortController(),
    } as QueueItem<T>);

    callback(cid, 'executing', source);

    return promiseToObservable(() =>
      // fetch by item source
      fetchIpfsContent<T>(cid, source, {
        controller,
        node: this.node,
      })
    ).pipe(
      timeout({
        each: settings.timeout,
        with: () =>
          throwError(() => {
            controller?.abort('timeout');
            return new QueueItemTimeoutError(settings.timeout);
          }),
      }),
      map(
        (result): QueueItemResult<T> => ({
          item,
          status: result ? 'completed' : 'error',
          source,
          result,
        })
      ),
      catchError((error): Observable<QueueItemResult<T>> => {
        // console.log('-errror queue', error);
        if (error instanceof QueueItemTimeoutError) {
          return of({
            item,
            status: 'timeout',
            source,
          });
        }
        if (error.name === 'AbortError') {
          return of({ item, status: 'cancelled', source });
        }
        return of({ item, status: 'error', source });
      })
    );
  }

  /**
   * Mutate queue item, and return new queue
   * @param cid
   * @param changes
   * @returns
   */
  private mutateItem(cid: string, changes: Partial<QueueItem<T>>) {
    const queue = this.queue$.value;
    const item = queue.get(cid);
    if (item) {
      queue.set(cid, { ...item, ...changes });
      // this.queue$.next(queue);
    }

    return queue;
  }

  constructor(
    strategy: QueueStrategy = strategies.embedded,
    queueDebounceMs = QUEUE_DEBOUNCE_MS
  ) {
    this.strategy = strategy;
    this.queueDebounceMs = queueDebounceMs;

    this.queue$
      .pipe(
        // tap((queue) => console.log('---tap', queue)),
        debounceTime(this.queueDebounceMs),
        mergeMap((queue) => {
          const workItems = this.getItemBySourceAndPriority(queue);
          // console.log('-mergemap', workItems.length, this.executing);
          if (workItems.length > 0) {
            return concat(...workItems.map((item) => this.fetchData$(item))); //.pipe(debounceTime(this.queueDebounceMs));
          }
          return EMPTY;
        })
      )
      .subscribe(({ item, status, source, result }) => {
        item.callback(item.cid, status, source, result);

        this.executing[source]--;

        // Correct execution -> next
        if (status === 'completed' || status === 'cancelled') {
          // console.log('------done', item, status, source, result);

          this.removeAndNext(item.cid);
          return;
        }
        // console.log('------error', item, status, source, result);

        // Retry -> (next sources) or -> next
        const nextSource = this.strategy.getNextSource(source);
        if (nextSource) {
          this.switchSourceAndNext(item, nextSource);
        } else {
          this.removeAndNext(item.cid);
        }
      });
  }

  private removeAndNext(cid: string): void {
    const queue = this.queue$.value;
    queue.delete(cid);
    this.queue$.next(queue);
  }

  // reset status and switch to next source
  private switchSourceAndNext(
    item: QueueItem<T>,
    nextSource: QueueSource
  ): void {
    this.queue$.next(
      this.mutateItem(item.cid, { status: 'pending', source: nextSource })
    );
  }

  public enqueue(
    cid: string,
    callback: QueueItemCallback<T>,
    options: QueueItemOptions = {}
  ): void {
    // const { priority = 0, viewPortPriority = 0, ...restOptions } = options;
    const item: QueueItem<T> = {
      cid,
      callback,
      source: this.strategy.order[0], // initial method to fetch
      status: 'pending',
      ...options,
    };

    const queue = this.queue$.value;
    queue.set(cid, item);
    this.queue$.next(queue);
  }

  public updateViewPortPriority(cid: string, viewPortPriority: number) {
    this.queue$.next(this.mutateItem(cid, { viewPortPriority }));
  }

  public cancel(cid: string): void {
    const queue = this.queue$.value;
    const item = queue.get(cid);
    if (item) {
      // If item has no abortController we can just remove it
      // Otherwise abort&keep-to-finalize
      if (!item.controller) {
        this.removeAndNext(cid);
      } else {
        item.controller.abort('cancelled');
      }
    }
  }

  public cancelByParent(parent: string): void {
    const nextQueue: QueueMap<T> = new Map();

    this.queue$.value.forEach((item, cid) => {
      // If item managed by abortController abort&keep-to-finalize
      // Otherwise keep all non-parent items
      if (item.parent !== parent) {
        nextQueue.set(cid, item);
      } else if (item.controller) {
        item.controller.abort('cancelled');
        nextQueue.set(cid, item);
      }
    });

    this.queue$.next(nextQueue);
  }

  public getQueue(): QueueItem<T>[] {
    return Array.from(this.queue$.value.values());
  }

  public getStats(): QueueStats[] {
    const fn = R.pipe(
      R.countBy<QueueItem<T>>(R.prop('status')),
      R.toPairs,
      R.map(R.zipObj(['status', 'count']))
    );

    return fn(this.getQueue()) as QueueStats[];
  }
}

export default QueueManager;
