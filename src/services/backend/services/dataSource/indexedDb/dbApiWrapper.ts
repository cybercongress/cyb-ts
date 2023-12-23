import {
  EntryType,
  LinkDbEntity,
  ParticleDbEntity,
  PinDbEntity,
  SyncStatusDbEntity,
  TransactionDbEntity,
  SyncQueueStatus,
} from 'src/services/CozoDb/types/entities';
import { NeuronAddress, ParticleCid, TransactionHash } from 'src/types/base';

// import { DbWorkerApi } from '../../workers/db/worker';
// import dbApiServiceProxy, {
//   DbApiServiceProxy,
// } from 'src/services/backend/workers/db/service';

import {
  dbResultToDtoList,
  removeUndefinedFields,
  transformListToDbEntity,
  transformToDbEntity,
} from 'src/services/CozoDb/utils';

import { CozoDbWorker } from 'src/services/backend/workers/db/worker';
import {
  LinkDto,
  ParticleDto,
  SyncQueueDto,
  SyncStatusDto,
} from 'src/services/CozoDb/types/dto';

import { SenseResult, SenseUnread } from './type';
import { SyncQueueItem } from '../../sync/types';

const TIMESTAMP_INTITAL = 0;

type SyncStatus = {
  unreadCount: number;
  timestampUpdate: number;
  timestampRead: number;
};

function DbApiWrapper() {
  let db: CozoDbWorker | undefined;

  const init = (dbApi: CozoDbWorker) => {
    db = dbApi;
  };

  const getSyncStatus = async (id: NeuronAddress | ParticleCid) => {
    const result = await db!.executeGetCommand(
      'sync_status',
      ['timestamp_update', 'unread_count', 'timestamp_read'],
      [`id = '${id}'`],
      ['id']
    );

    if (!result.ok) {
      throw new Error(result.message);
    }

    const row = result.rows.length
      ? result.rows[0]
      : [TIMESTAMP_INTITAL, 0, TIMESTAMP_INTITAL];

    return {
      timestampUpdate: row[0],
      unreadCount: row[1],
      timestampRead: row[2],
    } as SyncStatus;
  };

  const putSyncStatus = async (entity: SyncStatusDto[] | SyncStatusDto) => {
    const entitites = transformListToDbEntity(
      Array.isArray(entity) ? entity : [entity]
    );

    const result = await db!.executePutCommand('sync_status', entitites);
    console.log('putSyncStatus', result);
  };

  const updateSyncStatus = async (entity: Partial<SyncStatusDto>) => {
    return db!.executeUpdateCommand('sync_status', [
      transformToDbEntity(removeUndefinedFields(entity)),
    ]);
  };

  const putTransactions = async (transactions: TransactionDbEntity[]) =>
    db!.executePutCommand('transaction', transactions);

  const findSyncStatus = async ({
    entryType,
    id,
  }: {
    entryType?: EntryType;
    id?: NeuronAddress | ParticleCid;
  }) => {
    const conditions = [];

    entryType && conditions.push(`entry_type = ${entryType}`);

    id && conditions.push(`id = '${id}'`);

    const result = await db!.executeGetCommand(
      'sync_status',
      ['id', 'unread_count', 'timestamp_update', 'timestamp_read'],
      conditions,
      ['entry_type']
    );

    if (!result.ok) {
      throw new Error("Can't get particles to sync");
    }

    return result;
  };

  const putPins = async (pins: PinDbEntity[] | PinDbEntity) => {
    const entitites = Array.isArray(pins) ? pins : [pins];
    return db!.executePutCommand('pin', entitites);
  };

  const getPins = async (withType = false) => {
    const fields = withType ? ['cid', 'type'] : ['cid'];
    const result = await db!.executeGetCommand('pin', fields);

    if (!result.ok) {
      throw new Error(result.message);
    }

    return result;
  };

  const deletePins = async (pins: ParticleCid[]) =>
    db!.executeRmCommand(
      'pin',
      pins.map((cid) => ({ cid } as Partial<PinDbEntity>))
    );

  const putParticles = async (particles: ParticleDto[] | ParticleDto) => {
    const entitites = transformListToDbEntity(
      Array.isArray(particles) ? particles : [particles]
    );
    await db!.executePutCommand('particle', entitites);
  };

  const getParticles = async (fields: string[]) => {
    const result = await db!.executeGetCommand('particle', fields);

    if (!result.ok) {
      throw new Error(result.message);
    }

    return result;
  };

  const getSenseList = async () => {
    const syncFields =
      'entry_type, id, unread_count, timestamp_update, timestamp_read, last_id, meta';
    const valueNames = `${syncFields}, value, type`;
    const command = `
    dt[${valueNames}] := *sync_status{${syncFields}}, entry_type=1, *transaction{hash: last_id, value, type}
    dt[${valueNames}] := *sync_status{${syncFields}}, entry_type=2, *particle{cid: last_id, text, mime}, value=text, type=mime
    dt[${valueNames}] := *sync_status{${syncFields}}, entry_type=2, not *particle{cid: last_id, text, mime}, value='', type=''
    ?[${valueNames}] := dt[${valueNames}]
    :order -timestamp_update
    `;

    const result = await db!.runCommand(command);

    return dbResultToDtoList(result) as SenseResult[];
  };

  const getSenseSummary = async () => {
    const command = `
    dt[entry_type, sum(unread_count)] := *sync_status{entry_type, unread_count}, entry_type=1
    dt[entry_type, sum(unread_count)] := *sync_status{entry_type, unread_count}, entry_type=2
    ?[entry_type, unread] := dt[entry_type, unread]`;

    const result = await db!.runCommand(command);
    return dbResultToDtoList(result) as SenseUnread[];
  };

  const senseMarkAsRead = async (id: NeuronAddress | ParticleCid) => {
    const result = await db!.executeGetCommand(
      'sync_status',
      ['timestamp_update'],
      [`id = '${id}'`],
      ['id']
    );
    const timestampUpdate = result.rows[0];
    updateSyncStatus({
      id,
      timestampUpdate,
      timestampRead: timestampUpdate,
      unreadCount: 0,
    });
  };

  const getTransactions = async (neuron: NeuronAddress) => {
    const result = await db!.executeGetCommand(
      'transaction',
      ['hash', 'type', 'success', 'value', 'timestamp'],
      [`neuron = '${neuron}'`],
      ['neuron'],
      { orderBy: ['-timestamp'] }
    );
    return dbResultToDtoList(result);
  };

  const putCyberlinks = async (links: LinkDto[] | LinkDto) => {
    const entitites = Array.isArray(links) ? links : [links];
    //     await dbApi.executeBatchPutCommand(
    //       'link',
    //       links.map((l) => ({ ...l, neuron: '' })),
    //       100
    //     );
    console.log('------putCyberlinks', entitites);
    return db!.executePutCommand('link', entitites);
  };

  const putSyncQueue = async (item: SyncQueueItem[] | SyncQueueItem) => {
    const entitites = Array.isArray(item) ? item : [item];
    return db!.executePutCommand('sync_queue', entitites);
  };

  const updateSyncQueue = async (
    item: Partial<SyncQueueDto>[] | Partial<SyncQueueDto>
  ) => {
    const entitites = Array.isArray(item) ? item : [item];
    return db!.executeUpdateCommand('sync_queue', entitites);
  };

  const removeSyncQueue = async (id: ParticleCid) => {
    return db!.executeRmCommand('sync_queue', [{ id }]);
  };

  const getSyncQueue = async ({
    statuses,
    limit,
  }: {
    statuses: SyncQueueStatus[];
    limit?: number;
  }): Promise<SyncQueueDto[]> => {
    const result = await db!.executeGetCommand(
      'sync_queue',
      ['id', 'status', 'priority'],
      [`status in [${statuses.join(',')}]`],
      [],
      { orderBy: ['-priority'], limit }
    );

    if (!result.ok) {
      throw new Error(result.message);
    }

    return result.rows.map((row) => ({
      id: row[0] as string,
      status: row[1] as SyncQueueStatus,
      priority: row[2] as number,
    }));
  };

  const getLinks = async (cid: ParticleCid) => {
    const command = `pf[mime, text, from, to, dir, timestamp] := *link{from, to,timestamp}, *particle{cid: from, text, mime}, dir='from'
    pf[mime, text, from, to, dir, timestamp] := *link{from, to, timestamp}, *particle{cid: to, text, mime}, dir='to'
    ?[timestamp, dir, text, mime, from, to] := pf[mime, text, from, to, dir, timestamp], from='${cid}' or to='${cid}'
    :order -timestamp`;
    const result = await db!.runCommand(command);
    return dbResultToDtoList(result);
  };

  return {
    init,
    getSyncStatus,
    putSyncStatus,
    updateSyncStatus,
    putTransactions,
    findSyncStatus,
    putPins,
    deletePins,
    getPins,
    getParticles,
    putParticles,
    getSenseList,
    getSenseSummary,
    senseMarkAsRead,
    getTransactions,
    putCyberlinks,
    putSyncQueue,
    updateSyncQueue,
    getSyncQueue,
    removeSyncQueue,
    getLinks,
  };
}
const dbApiWrapperInstance = DbApiWrapper();

export type DbApi = typeof dbApiWrapperInstance;

export default dbApiWrapperInstance;
