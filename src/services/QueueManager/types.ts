import { IPFSContentMaybe, IpfsContentSource } from '../ipfs/ipfs';
import { LinkDbEntity } from '../CozoDb/types/entities';

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

export type QueueSource = IpfsContentSource;

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

export type QueueItemPostProcessor = (
  content: IPFSContentMaybe
) => Promise<IPFSContentMaybe>;

export interface IDefferedDbProcessor {
  // postProcess: (content: IPFSContentMaybe) => Promise<IPFSContentMaybe>;
  enuqueIpfsContent: (content: IPFSContentMaybe) => void;
  enqueueLinks: (links: LinkDbEntity[]) => void;
}

export type EnqueuedIpfsResult = QueueItemAsyncResult<IPFSContentMaybe>;