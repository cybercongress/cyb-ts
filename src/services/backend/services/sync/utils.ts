import { dateToNumber } from 'src/utils/date';

import {
  CyberLinkSimple,
  CyberLinkTimestamp,
  Cyberlink,
  ParticleCid,
} from 'src/types/base';
import { CID_TWEET } from 'src/utils/consts';
import {
  Transaction,
  CYBER_LINK_TRANSACTION_TYPE,
  CyberLinkTransaction,
} from '../dataSource/blockchain/types';
import { FetchIpfsFunc, ParticleResult, SyncQueueItem } from './types';
import { SyncStatusDto } from 'src/services/CozoDb/types/dto';
import { fetchCyberlinksIterable } from '../dataSource/blockchain/requests';
import { EntryType } from 'src/services/CozoDb/types/entities';

export function extractParticlesResults(batch: Transaction[]) {
  const cyberlinks = batch.filter(
    (l) => l.type === CYBER_LINK_TRANSACTION_TYPE
  ) as CyberLinkTransaction[];
  const particlesFound = new Set<string>();
  const links: CyberLinkTimestamp[] = [];
  // Get links: only from TWEETS
  const particleTimestampRecord: Record<ParticleCid, ParticleResult> =
    cyberlinks.reduce<Record<ParticleCid, ParticleResult>>(
      (
        acc,
        {
          value,
          transaction: {
            block: { timestamp },
          },
        }: CyberLinkTransaction
      ) => {
        value.links.forEach((link) => {
          particlesFound.add(link.to);
          particlesFound.add(link.from);
          links.push({ ...link, timestamp: dateToNumber(timestamp) });
          if (link.from === CID_TWEET) {
            acc[link.to] = {
              timestamp: dateToNumber(timestamp),
              direction: 'from',
              from: CID_TWEET,
              to: link.to,
            };
          }
        });
        return acc;
      },
      {}
    );

  return {
    tweets: particleTimestampRecord,
    particlesFound: [...particlesFound],
    links,
  };
}

export async function fetchCyberlinksAndGetStatus(
  cyberIndexUrl: string,
  cid: ParticleCid,
  timestampUpdate = 0,
  timestampRead = 0,
  unreadCount = 0,
  resolveAndSaveParticle: FetchIpfsFunc,
  pushToSyncQueue: (items: SyncQueueItem[]) => Promise<void>
): Promise<SyncStatusDto | undefined> {
  const cyberlinsIterable = fetchCyberlinksIterable(
    cyberIndexUrl,
    cid,
    timestampUpdate
  );

  const links = [];
  for await (const batch of cyberlinsIterable) {
    links.push(...batch);
  }

  if (!links.length) {
    return undefined;
  }
  // firstTimestamp, lastTimestamp, count, lastLinkedParticle, isFrom
  const lastTimestamp = dateToNumber(links[0].timestamp);
  const lastTo = links[0].to;
  const lastFrom = links[0].from;
  const firstTimestamp = dateToNumber(links[links.length - 1].timestamp);
  const count = links.length;
  const isFrom = lastFrom === cid;

  const lastId = isFrom ? lastTo : lastFrom;

  // resolve particle direct
  await resolveAndSaveParticle(lastId);

  // await this.db!.putSyncQueue(
  //   links.map((link) => ({ id: link.to, priority: 1 }))
  // );

  // resolve particles using ueue
  await pushToSyncQueue(links.map((link) => ({ id: link.to, priority: 1 })));

  const syncStatus = {
    id: cid as string,
    timestampUpdate: lastTimestamp,
    timestampRead: count ? timestampRead : firstTimestamp,
    unreadCount: unreadCount + count,
    lastId,
    meta: { direction: isFrom ? 'from' : 'to' },
    disabled: false,
    entryType: EntryType.particle,
  } as SyncStatusDto;

  return syncStatus;
}
