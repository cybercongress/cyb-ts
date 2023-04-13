/* eslint-disable import/no-unused-modules */
type QueueItemStatus =
  | 'pending'
  | 'executing'
  | 'timeout'
  | 'completed'
  | 'cancelled'
  | 'error';

export type QueueStats = {
  status: QueueItemStatus;
  count: number;
};

export type QueueItemCallback<T> = (
  cid: string,
  status: QueueItemStatus,
  result?: T
) => void;

export type QueueItemOptions = {
  controller?: AbortController;
  parent?: string;
  priority?: number;
};

export type QueueItem<T> = {
  cid: string;
  promiseFactory: () => Promise<T>;
  status: QueueItemStatus;
  callback: QueueItemCallback<T>;
} & QueueItemOptions;

export type QueueItemResult<T> = {
  item: Omit<QueueItem<T>, 'promiseFactory'>;
  status: QueueItemStatus;
  result?: T;
};
