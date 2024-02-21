import { dateToNumber } from 'src/utils/date';

import { NeuronAddress, ParticleCid } from 'src/types/base';
import { SyncStatusDto } from 'src/services/CozoDb/types/dto';
import { EntryType } from 'src/services/CozoDb/types/entities';

import { CyberlinksByParticleResponse } from '../dataSource/blockchain/indexer';
import { findLast, findLastIndex } from 'lodash';

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

export function getLastReadInfo(
  links: CyberlinksByParticleResponse['cyberlinks'],
  ownerId: NeuronAddress,
  prevTimestampRead = 0,
  prevUnreadCount = 0
) {
  const lastMyLinkIndex = findLastIndex(
    links,
    (link) => link.neuron === ownerId
  );

  const unreadCount =
    lastMyLinkIndex < 0
      ? (prevUnreadCount || 0) + links.length
      : links.length - lastMyLinkIndex - 1;

  const timestampRead =
    lastMyLinkIndex < 0
      ? prevTimestampRead
      : dateToNumber(links[lastMyLinkIndex].timestamp);

  return { timestampRead, unreadCount };
}

export function changeSyncStatus(
  statusEntity: Partial<SyncStatusDto>,
  links: CyberlinksByParticleResponse['cyberlinks'],
  ownerId: NeuronAddress
) {
  const lastLink = links[0];
  const timestampUpdate = dateToNumber(links[0].timestamp);
  const { timestampRead, unreadCount } = getLastReadInfo(
    links,
    ownerId,
    statusEntity.timestampRead,
    statusEntity.unreadCount
  );

  return {
    ...statusEntity,
    ownerId,
    entryType: EntryType.particle,
    disabled: false,
    unreadCount,
    meta: { ...lastLink, timestamp: timestampUpdate },
    timestampRead,
    timestampUpdate,
  } as SyncStatusDto;
}
