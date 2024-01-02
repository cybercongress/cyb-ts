import { dateToNumber } from 'src/utils/date';

import { CyberLinkTimestamp, ParticleCid } from 'src/types/base';
import { CID_TWEET } from 'src/utils/consts';
import { SyncStatusDto } from 'src/services/CozoDb/types/dto';

import {
  Transaction,
  CYBER_LINK_TRANSACTION_TYPE,
  CyberLinkTransaction,
} from '../dataSource/blockchain/types';
import { ParticleResult } from './types';
import { CyberlinksByParticleResponse } from '../dataSource/blockchain/requests';

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

export function extractLinkData(
  cid: ParticleCid,
  links: CyberlinksByParticleResponse['cyberlinks']
) {
  const isFrom = links[0].from === cid;

  return {
    direction: (isFrom ? 'from' : 'to') as 'from' | 'to',
    lastLinkCid: isFrom ? links[0].to : links[0].from,
    count: links.length,
    lastTimestamp: dateToNumber(links[0].timestamp),
    firstTimestamp: dateToNumber(links[links.length - 1].timestamp),
  };
}

export function updateSyncState(
  statusEntity: Partial<SyncStatusDto>,
  links: CyberlinksByParticleResponse['cyberlinks']
) {
  const { direction, lastLinkCid, count, lastTimestamp, firstTimestamp } =
    extractLinkData(statusEntity.id as ParticleCid, links);

  const unreadCount = (statusEntity.unreadCount || 0) + count;
  const timestampRead = count ? statusEntity.timestampRead : firstTimestamp;
  return {
    ...statusEntity,
    lastId: lastLinkCid,
    unreadCount,
    meta: { direction },
    timestampUpdate: lastTimestamp,
    timestampRead,
  } as SyncStatusDto;
}
