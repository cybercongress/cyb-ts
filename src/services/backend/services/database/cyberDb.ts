import {
  EntryType,
  ParticleDbEntry,
  PinDbEntry,
  SyncStatusDbEntry,
  TransactionDbEntry,
} from 'src/services/CozoDb/types';
import { NeuronAddress, ParticleCid } from 'src/types/base';

import { DbWorkerApi } from '../../workers/db/worker';

const TIMESTAMP_INTITAL = 958718452000;

type SyncStatus = {
  unreadCount: number;
  timestampUpdate: number;
  timestampRead: number;
};

function CybDb() {
  let db: DbWorkerApi | undefined;

  const init = (dbApi: DbWorkerApi) => {
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

  const putSyncStatus = async (
    entity: SyncStatusDbEntry[] | SyncStatusDbEntry
  ) => {
    const entitites = Array.isArray(entity) ? entity : [entity];
    await db!.executePutCommand('sync_status', entitites);
  };

  const updateSyncStatus = async (
    id: NeuronAddress | ParticleCid,
    timestampUpdate: number,
    timestampRead: number,
    unreadCount: number
  ) => {
    const entity = {
      id,
      timestamp_update: timestampUpdate,
      timestamp_read: timestampRead,
      unread_count: unreadCount,
    };
    db!.executeUpdateCommand('sync_status', [entity]);
  };

  const putTransactions = async (transactions: TransactionDbEntry[]) =>
    db!.executePutCommand('transaction', transactions);

  const findSyncStatus = async (
    entryType: EntryType,
    id?: NeuronAddress | ParticleCid
  ) => {
    const conditions = [`entry_type = ${entryType}`];

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

  const putPins = async (pins: PinDbEntry[] | PinDbEntry) => {
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

  const deletePins = async (entitites: ParticleCid[]) =>
    db!.executeRmCommand('pin', entitites);

  const putParticles = async (
    particles: ParticleDbEntry[] | ParticleDbEntry
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
  };
}

export { CybDb };
