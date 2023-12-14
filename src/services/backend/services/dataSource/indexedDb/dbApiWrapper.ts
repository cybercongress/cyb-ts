import {
  EntryType,
  LinkDbEntity,
  ParticleDbEntity,
  PinDbEntity,
  SyncStatusDbEntity,
  TransactionDbEntity,
} from 'src/services/CozoDb/types';
import { NeuronAddress, ParticleCid, TransactionHash } from 'src/types/base';

// import { DbWorkerApi } from '../../workers/db/worker';
// import dbApiServiceProxy, {
//   DbApiServiceProxy,
// } from 'src/services/backend/workers/db/service';

import { dbResultToObjects } from 'src/services/CozoDb/utils';

import { DbApiService } from 'src/services/backend/workers/db/service';

import { SenseResult, SenseUnread } from './type';

const TIMESTAMP_INTITAL = 958718452000;

type SyncStatus = {
  unreadCount: number;
  timestampUpdate: number;
  timestampRead: number;
};

function DbApiWrapper() {
  let db: DbApiService | undefined;

  const init = (dbApi: DbApiService) => {
    db = dbApi;
    console.log('------DbApiWrapper initialized', db);
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

  const putSyncStatus = async (
    entity: SyncStatusDbEntity[] | SyncStatusDbEntity
  ) => {
    const entitites = Array.isArray(entity) ? entity : [entity];
    await db!.executePutCommand('sync_status', entitites);
  };

  const updateSyncStatus = async (
    id: NeuronAddress | ParticleCid,
    timestampUpdate: number,
    timestampRead: number,
    unreadCount: number,
    lastEntityId: TransactionHash | ParticleCid = ''
  ) => {
    const entity = {
      id,
      timestamp_update: timestampUpdate,
      timestamp_read: timestampRead,
      unread_count: unreadCount,
      last_id: lastEntityId,
    } as Partial<SyncStatusDbEntity>;

    db!.executeUpdateCommand('sync_status', [entity]);
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
    await db!.executePutCommand('pin', entitites);
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

  const putParticles = async (
    particles: ParticleDbEntity[] | ParticleDbEntity
  ) => {
    const entitites = Array.isArray(particles) ? particles : [particles];
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
      'entry_type, id, unread_count, timestamp_update, timestamp_read, last_id';
    const valueNames = `${syncFields}, value, type`;
    const command = `
    dt[${valueNames}] := *sync_status{${syncFields}}, entry_type=1, *transaction{hash: last_id, value, type}
    dt[${valueNames}] := *sync_status{${syncFields}}, entry_type=2, *particle{cid: last_id, text, mime}, value=text, type=mime
    ?[${valueNames}] := dt[${valueNames}]
    `;

    const result = await db!.runCommand(command);

    return dbResultToObjects(result) as SenseResult[];
  };

  const getSenseSummary = async () => {
    const command = `
    dt[entry_type, sum(unread_count)] := *sync_status{entry_type, unread_count}, entry_type=1
    dt[entry_type, sum(unread_count)] := *sync_status{entry_type, unread_count}, entry_type=2
    ?[entry_type, unread] := dt[entry_type, unread]`;

    const result = await db!.runCommand(command);
    return dbResultToObjects(result) as SenseUnread[];
  };

  const senseMarkAsRead = async (id: NeuronAddress | ParticleCid) => {
    const result = await db!.executeGetCommand(
      'sync_status',
      ['timestamp_update'],
      [`id = '${id}'`],
      ['id']
    );
    const timestampUpdate = result.rows[0];
    updateSyncStatus(id, timestampUpdate, timestampUpdate, 0);
  };

  const getTransactions = async (neuron: NeuronAddress) => {
    const result = await db!.executeGetCommand(
      'transaction',
      ['hash', 'type', 'success', 'value', 'timestamp'],
      [`neuron = ${neuron}`],
      ['neuron']
    );
    return dbResultToObjects(result);
  };

  const putCyberlinks = async (links: LinkDbEntity[] | LinkDbEntity) => {
    const entitites = Array.isArray(links) ? links : [links];
    //     await dbApi.executeBatchPutCommand(
    //       'link',
    //       links.map((l) => ({ ...l, neuron: '' })),
    //       100
    //     );
    return db!.executePutCommand('links', entitites);
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
  };
}
const dbApiWrapperInstance = DbApiWrapper();

export type DbApi = typeof dbApiWrapperInstance;

export default dbApiWrapperInstance;
