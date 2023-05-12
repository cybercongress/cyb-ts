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
  merge,
  tap,
  interval,
  filter,
} from 'rxjs';

import * as R from 'ramda';

import {
  fetchIpfsContent,
  reconnectToCyberSwarm,
} from 'src/utils/ipfs/utils-ipfs';
import { AppIPFS, IpfsContentSource } from 'src/utils/ipfs/ipfs';

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
const CONNECTION_KEEPER_RETRY_MS = 5000;

function getQueueItemTotalPriority<T>(item: QueueItem<T>): number {
  return (item.priority || 0) + (item.viewPortPriority || 0);
}

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

  private lastNodeCallTime: number = Date.now();

  private executing: Record<QueueSource, Set<string>> = {
    db: new Set(),
    node: new Set(),
    gateway: new Set(),
  };

  private switchStrategy(strategy: QueueStrategy): void {
    this.strategy = strategy;
  }

  public setNode(node: AppIPFS) {
    // console.log(`switch node from ${this.node?.nodeType} to ${node.nodeType}`);

    this.node = node;
    this.switchStrategy(strategies[node.nodeType]);
  }

  private getItemBySourceAndPriority(queue: QueueMap<T>) {
    const pendingItems = [...queue.values()].filter(
      (i) => i.status === 'pending'
    );

    const pendingBySource = R.groupBy((i) => i.source, pendingItems);

    const itemsToExecute: QueueItem<T>[] = [];
    // eslint-disable-next-line no-loop-func, no-restricted-syntax
    for (const [queueSource, items] of Object.entries(pendingBySource)) {
      const settings = this.strategy.settings[queueSource as IpfsContentSource];

      const executeCount =
        settings.maxConcurrentExecutions -
        this.executing[queueSource as IpfsContentSource].size;

      const itemsByPriority = items
        .sort(
          (a, b) => getQueueItemTotalPriority(b) - getQueueItemTotalPriority(a)
        )
        .slice(0, executeCount);
      itemsToExecute.push(...itemsByPriority);
    }

    return itemsToExecute;
  }

  private fetchData$(item: QueueItem<T>) {
    const { cid, source, controller, callbacks } = item;
    const settings = this.strategy.settings[source];
    this.executing[source].add(cid);

    const queueItem = this.queue$.value.get(cid);
    // Mutate item without next
    this.queue$.value.set(cid, {
      ...queueItem,
      status: 'executing',
      executionTime: Date.now(),
      controller: new AbortController(),
    } as QueueItem<T>);

    callbacks.map((callback) => callback(cid, 'executing', source));

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
  private mutateQueueItem(cid: string, changes: Partial<QueueItem<T>>) {
    const queue = this.queue$.value;
    const item = queue.get(cid);
    if (item) {
      queue.set(cid, { ...item, ...changes });
    }

    return queue;
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
      this.mutateQueueItem(item.cid, { status: 'pending', source: nextSource })
    );
  }

  private cancelDeprioritizedItems(queue: QueueMap<T>): QueueMap<T> {
    (['node', 'gateway'] as IpfsContentSource[]).forEach((source) =>
      Array.from(this.executing[source]).forEach((cid) => {
        const item = queue.get(cid);

        if (item && getQueueItemTotalPriority(item) < 0 && item.controller) {
          // abort request and move to pending
          item.controller.abort('cancelled');
          queue.set(cid, { ...item, status: 'pending' });

          this.executing[source].delete(cid);
        }
      })
    );

    return queue;
  }

  private releaseExecution(cid: string) {
    // eslint-disable-next-line no-restricted-syntax
    Object.keys(this.executing).forEach((key) =>
      this.executing[key as IpfsContentSource].delete(cid)
    );
  }

  constructor(
    strategy: QueueStrategy = strategies.embedded,
    queueDebounceMs = QUEUE_DEBOUNCE_MS
  ) {
    this.strategy = strategy;
    this.queueDebounceMs = queueDebounceMs;

    // Little hack to handle keep-alive connection to swarm cyber node
    // Fix some lag with node peers(when it shown swarm node in peers but not  connected anymore)
    interval(CONNECTION_KEEPER_RETRY_MS)
      .pipe(filter(() => this.queue$.value.size > 0 && !!this.node))
      .subscribe(() => reconnectToCyberSwarm(this.node, this.lastNodeCallTime));

    this.queue$
      .pipe(
        // tap((queue) => console.log('---tap', queue)),
        debounceTime(this.queueDebounceMs),
        map((queue) => this.cancelDeprioritizedItems(queue)),
        mergeMap((queue) => {
          const workItems = this.getItemBySourceAndPriority(queue);

          if (workItems.length > 0) {
            // wake up connnection to swarm cyber node
            reconnectToCyberSwarm(this.node, this.lastNodeCallTime);

            return merge(...workItems.map((item) => this.fetchData$(item)));
          }
          return EMPTY;
        })
      )
      .subscribe(({ item, status, source, result }) => {
        item.callbacks.map((callback) =>
          callback(item.cid, status, source, result)
        );

        // HACK to use with GracePeriod for reconnection
        if (source === 'node') {
          this.lastNodeCallTime = Date.now();
        }

        this.executing[source].delete(item.cid);

        // success execution -> next
        if (status === 'completed' || status === 'cancelled') {
          // console.log('------done', item, status, source, result);
          this.removeAndNext(item.cid);
        } else {
          // console.log('------error', item, status, source, result);
          // Retry -> (next sources) or -> next
          const nextSource = this.strategy.getNextSource(source);

          if (nextSource) {
            this.switchSourceAndNext(item, nextSource);
          } else {
            this.removeAndNext(item.cid);
          }
        }
      });
  }

  public enqueue(
    cid: string,
    callback: QueueItemCallback<T>,
    options: QueueItemOptions = {}
  ): void {
    const queue = this.queue$.value;

    const existingItem = queue.get(cid);

    // In case if item already in queue,
    // just attach one more callback to quieued item
    if (existingItem) {
      this.mutateQueueItem(cid, {
        callbacks: [...existingItem.callbacks, callback],
      });
    } else {
      const item: QueueItem<T> = {
        cid,
        callbacks: [callback],
        source: options.initialSource || this.strategy.order[0], // initial method to fetch
        status: 'pending',
        ...options,
      };

      queue.set(cid, item);
      this.queue$.next(queue);
    }
  }

  public updateViewPortPriority(cid: string, viewPortPriority: number) {
    this.queue$.next(this.mutateQueueItem(cid, { viewPortPriority }));
  }

  public cancel(cid: string): void {
    const queue = this.queue$.value;
    const item = queue.get(cid);
    if (item) {
      // If item has no abortController we can just remove it,
      // otherwise abort&keep-to-finalize
      if (!item.controller) {
        this.removeAndNext(cid);
      } else {
        item.controller.abort('cancelled');
      }
    }
  }

  public cancelByParent(parent: string): void {
    const queue = this.queue$.value;

    queue.forEach((item, cid) => {
      if (item.parent === parent) {
        this.releaseExecution(cid);
        item.controller?.abort('cancelled');
        queue.delete(cid);
      }
    });

    this.queue$.next(queue);
  }

  public getQueueMap(): QueueMap<T> {
    return this.queue$.value;
  }

  public getQueueList(): QueueItem<T>[] {
    return Array.from(this.queue$.value.values());
  }

  public getStats(): QueueStats[] {
    const fn = R.pipe(
      R.countBy<QueueItem<T>>(R.prop('status')),
      R.toPairs,
      R.map(R.zipObj(['status', 'count']))
    );

    return fn(this.getQueueList()) as QueueStats[];
  }
}

export default QueueManager;
