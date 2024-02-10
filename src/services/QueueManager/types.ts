import { IPFSContentMaybe, IpfsContentSource } from '../ipfs/ipfs';
import { LinkDbEntity } from '../CozoDb/types/entities';
import { LinkDto } from '../CozoDb/types/dto';

/* eslint-disable import/no-unused-modules */
export type QueueItemStatus =
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

export enum QueuePriority {
  ZERO = 0,
  LOW = 0.1,
  MEDIUM = 0.5,
  HIGH = 0.9,
  URGENT = 1,
}
export type QueueItemOptions = {
  parent?: string;
  priority?: QueuePriority | number;
  viewPortPriority?: number;
  initialSource?: QueueSource;
  postProcessing?: boolean;
};

export type QueueItemCallback = (
  cid: string,
  status: QueueItemStatus,
  source: QueueSource,
  result?: IPFSContentMaybe
) => void;

export type QueueItem = {
  cid: string;
  source: QueueSource;
  status: QueueItemStatus;
  callbacks: QueueItemCallback[];
  controller?: AbortController;
  executionTime?: number;
} & Omit<QueueItemOptions, 'initialSource'>;

export type QueueItemResult = {
  item: QueueItem;
  status: QueueItemStatus;
  source: QueueSource;
  result?: IPFSContentMaybe;
};

export type QueueItemAsyncResult = Omit<QueueItemResult, 'item'>;

export type QueueItemPostProcessor = (
  content: IPFSContentMaybe
) => Promise<IPFSContentMaybe>;

export interface IDeferredDbSaver {
  // postProcess: (content: IPFSContentMaybe) => Promise<IPFSContentMaybe>;
  enqueueIpfsContent: (content: IPFSContentMaybe) => void;
  enqueueLinks: (links: LinkDto[]) => void;
}

export type FetchParticleAsync = (
  cid: string,
  options?: QueueItemOptions
) => Promise<QueueItemAsyncResult>;
