import { dateToNumber } from 'src/utils/date';

import { ParticleCid } from 'src/types/base';
import { SyncStatusDto } from 'src/services/CozoDb/types/dto';

import { CyberlinksByParticleResponse } from '../dataSource/blockchain/requests';
import { LinkDirection } from './types';

export function extractLinkData(
  cid: ParticleCid,
  links: CyberlinksByParticleResponse['cyberlinks']
) {
  const isFrom = links[0].from === cid;

  return {
    direction: (isFrom ? 'from' : 'to') as LinkDirection,
    lastLinkCid: isFrom ? links[0].to : links[0].from,
    count: links.length,
    lastTimestamp: dateToNumber(links[0].timestamp),
    firstTimestamp: dateToNumber(links[links.length - 1].timestamp),
  };
}

export function changeSyncStatus(
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
