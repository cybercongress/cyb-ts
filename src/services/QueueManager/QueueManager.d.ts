import type { IpfsContentSource } from 'src/utils/ipfs/ipfs';

/* eslint-disable import/no-unused-modules */
type QueueItemStatus =
  | 'pending'
  | 'executing'
  | 'timeout'
  | 'completed'
  | 'cancelled'
  | 'error'
  | 'not_found';

export type QueueSourceSettings = {
  timeout: number;
  maxConcurrentExecutions: number;
};

type QueueSource = IpfsContentSource;

export type QueueSettings = Record<QueueSource, QueueSourceSettings>;

export interface IQueueStrategy {
  settings: QueueSettings;
  order: QueueSource[];
  getNextSource(source: QueueSource): QueueSource | undefined;
}

export type QueueStats = {
  status: QueueItemStatus;
  count: number;
};

export type QueueItemOptions = {
  parent?: string;
  priority?: number;
  viewPortPriority?: number;
  initialSource?: QueueSource;
  postProcessing?: boolean;
};

export type QueueItemCallback<T> = (
  cid: string,
  status: QueueItemStatus,
  source: QueueSource,
  result?: T
) => void;

export type QueueItem<T> = {
  cid: string;
  source: QueueSource;
  status: QueueItemStatus;
  callbacks: QueueItemCallback<T>[];
  controller?: AbortController;
  executionTime?: number;
} & Omit<QueueItemOptions, 'initialSource'>;

export type QueueItemResult<T> = {
  item: QueueItem<T>;
  status: QueueItemStatus;
  source: QueueSource;
  result?: T;
};

export type QueueItemAsyncResult<T> = Omit<QueueItemResult<T>, 'item'>;
