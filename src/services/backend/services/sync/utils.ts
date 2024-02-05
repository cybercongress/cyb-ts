import { dateToNumber } from 'src/utils/date';

import { NeuronAddress, ParticleCid } from 'src/types/base';
import { SyncStatusDto } from 'src/services/CozoDb/types/dto';
import { EntryType } from 'src/services/CozoDb/types/entities';

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
  links: CyberlinksByParticleResponse['cyberlinks'],
  ownerId: NeuronAddress
) {
  const unreadCount = (statusEntity.unreadCount || 0) + links.length;
  const lastLink = links[0];
  const timestampUpdate = dateToNumber(links[0].timestamp);

  return {
    ...statusEntity,
    ownerId,
    entryType: EntryType.particle,
    disabled: false,
    unreadCount,
    meta: { ...lastLink, timestamp: timestampUpdate },
    timestampUpdate,
  } as SyncStatusDto;
}
