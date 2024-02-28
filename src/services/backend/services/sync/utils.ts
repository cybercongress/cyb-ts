import { dateToNumber } from 'src/utils/date';

import { NeuronAddress, ParticleCid } from 'src/types/base';
import { SyncStatusDto } from 'src/services/CozoDb/types/dto';
import { EntryType } from 'src/services/CozoDb/types/entities';

import { CyberlinksByParticleResponse } from '../dataSource/blockchain/indexer';
import { findLastIndex } from 'lodash';
import { SenseItemLinkMeta } from '../../types/sense';
import { transformToDto } from 'src/services/CozoDb/utils';

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
    (link) =>
      link.neuron === ownerId &&
      dateToNumber(link.timestamp) > prevTimestampRead
  );

  const unreadCount =
    lastMyLinkIndex < 0
      ? prevUnreadCount || 0
      : links.length - lastMyLinkIndex - 1;

  const timestampRead =
    lastMyLinkIndex < 0
      ? prevTimestampRead
      : dateToNumber(links[lastMyLinkIndex].timestamp);

  return {
    timestampRead,
    unreadCount,
  };
}

export function changeSyncStatus(
  statusEntity: Partial<SyncStatusDto>,
  links: CyberlinksByParticleResponse['cyberlinks'],
  ownerId: NeuronAddress
) {
  const timestampUpdate = dateToNumber(links[0].timestamp);
  const { timestampRead, unreadCount } = getLastReadInfo(
    links,
    ownerId,
    statusEntity.timestampRead,
    statusEntity.unreadCount
  );

  const lastLink = transformToDto(links[0]);

  return {
    ...statusEntity,
    ownerId,
    entryType: EntryType.particle,
    disabled: false,
    unreadCount,
    meta: {
      ...lastLink,
      timestamp: timestampUpdate,
    } as SenseItemLinkMeta,
    timestampRead,
    timestampUpdate,
  } as SyncStatusDto;
}
