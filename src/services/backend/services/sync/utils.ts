import { dateToUtcNumber } from 'src/utils/date';

import { NeuronAddress, ParticleCid } from 'src/types/base';
import { LinkDto, SyncStatusDto } from 'src/services/CozoDb/types/dto';
import { EntryType } from 'src/services/CozoDb/types/entities';

import { findLastIndex } from 'lodash';
import { entityToDto } from 'src/utils/dto';

import { SenseItemLinkMeta } from '../../types/sense';
import { SyncEntryName } from '../../types/services';

// export function extractLinkData(
//   cid: ParticleCid,
//   links: CyberlinksByParticleResponse['cyberlinks']
// ) {
//   return {
//     lastLink: links[0],
//     count: links.length,
//     lastTimestamp: dateToUtcNumber(links[0].timestamp),
//     firstTimestamp: dateToUtcNumber(links[links.length - 1].timestamp),
//   };
// }

export function getLastReadInfo(
  links: LinkDto[],
  ownerId: NeuronAddress,
  prevTimestampRead = 0,
  prevUnreadCount = 0
) {
  const lastMyLinkIndex = findLastIndex(
    links,
    (link) => link.neuron === ownerId && link.timestamp > prevTimestampRead
  );

  const unreadCount =
    lastMyLinkIndex < 0
      ? prevUnreadCount || 0
      : links.length - lastMyLinkIndex - 1;

  const timestampRead =
    lastMyLinkIndex < 0 ? prevTimestampRead : links[lastMyLinkIndex].timestamp;

  return {
    timestampRead,
    unreadCount,
  };
}

export function changeParticleSyncStatus(
  syncStatus: Partial<SyncStatusDto>,
  links: LinkDto[],
  ownerId: NeuronAddress,
  shouldUpdateTimestamp = true
) {
  const timestampUpdate = links[0].timestamp;
  const { timestampRead, unreadCount } = getLastReadInfo(
    links,
    ownerId,
    syncStatus.timestampRead,
    syncStatus.unreadCount
  );

  const lastLink = entityToDto(links[0]);

  return {
    ...syncStatus,
    ownerId,
    entryType: EntryType.particle,
    disabled: false,
    unreadCount,
    meta: {
      ...lastLink,
      timestamp: timestampUpdate,
    } as SenseItemLinkMeta,
    timestampRead,
    timestampUpdate: shouldUpdateTimestamp
      ? timestampUpdate
      : syncStatus.timestampUpdate,
  } as SyncStatusDto;
}

const mapSyncEntryReadable: Record<SyncEntryName, string> = {
  'my-friends': "friend's logs",
  particles: 'log cyberlinks',
  resolver: 'particles',
  transactions: 'transactions',
  pin: 'ipfs pins',
};

export const syncEntryNameToReadable = (name: SyncEntryName) =>
  mapSyncEntryReadable[name] || name;
