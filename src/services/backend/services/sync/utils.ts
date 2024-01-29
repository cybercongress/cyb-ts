import { dateToNumber } from 'src/utils/date';

import { ParticleCid } from 'src/types/base';
import { SyncStatusDto } from 'src/services/CozoDb/types/dto';

import { CyberlinksByParticleResponse } from '../dataSource/blockchain/indexer';

export function extractLinkData(
  cid: ParticleCid,
  links: CyberlinksByParticleResponse['cyberlinks']
) {
  return {
    lastLink: links[0],
    count: links.length,
    lastTimestamp: dateToNumber(links[0].timestamp),
    firstTimestamp: dateToNumber(links[links.length - 1].timestamp),
  };
}

export function changeSyncStatus(
  statusEntity: Partial<SyncStatusDto>,
  links: CyberlinksByParticleResponse['cyberlinks']
) {
  const { lastLink, count, lastTimestamp, firstTimestamp } = extractLinkData(
    statusEntity.id as ParticleCid,
    links
  );

  const unreadCount = (statusEntity.unreadCount || 0) + count;
  const timestampRead = count ? statusEntity.timestampRead : firstTimestamp;

  return {
    ...statusEntity,
    unreadCount,
    meta: lastLink,
    timestampUpdate: lastTimestamp,
    timestampRead,
  } as SyncStatusDto;
}
