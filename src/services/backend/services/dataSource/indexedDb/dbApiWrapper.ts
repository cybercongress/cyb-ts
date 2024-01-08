import {
  EntryType,
  PinDbEntity,
  TransactionDbEntity,
  SyncQueueStatus,
} from 'src/services/CozoDb/types/entities';
import { NeuronAddress, ParticleCid } from 'src/types/base';

import {
  dbResultToDtoList,
  jsonifyFields,
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
  TransactionDto,
} from 'src/services/CozoDb/types/dto';

import { SenseResult, SenseUnread } from './type';
import { SyncQueueItem } from '../../sync/types';

const TIMESTAMP_INTITAL = 0;

class DbApiWrapper {
  private db: CozoDbWorker | undefined;

  public init(dbApi: CozoDbWorker) {
    this.db = dbApi;
  }

  public async getSyncStatus(id: NeuronAddress | ParticleCid) {
    const result = await this.db!.executeGetCommand(
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
    } as SyncStatusDto;
  }

  public async putSyncStatus(entity: SyncStatusDto[] | SyncStatusDto) {
    const entitites = transformListToDbEntity(
      Array.isArray(entity) ? entity : [entity]
    );

    const result = await this.db!.executePutCommand('sync_status', entitites);
    // console.log('putSyncStatus', result);
    return result;
  }

  public async updateSyncStatus(entity: Partial<SyncStatusDto>) {
    return this.db!.executeUpdateCommand('sync_status', [
      transformToDbEntity(removeUndefinedFields(entity)),
    ]);
  }

  public async putTransactions(transactions: TransactionDbEntity[]) {
    return this.db!.executePutCommand('transaction', transactions);
  }

  public async findSyncStatus({
    entryType,
    id,
  }: {
    entryType?: EntryType;
    id?: NeuronAddress | ParticleCid;
  }) {
    const conditions = [];

    entryType && conditions.push(`entry_type = ${entryType}`);

    id && conditions.push(`id = '${id}'`);

    const result = await this.db!.executeGetCommand(
      'sync_status',
      ['id', 'unread_count', 'timestamp_update', 'timestamp_read'],
      conditions,
      ['entry_type']
    );

    return dbResultToDtoList(result) as Partial<SyncStatusDto>[];
  }

  public async putPins(pins: PinDbEntity[] | PinDbEntity) {
    const entitites = Array.isArray(pins) ? pins : [pins];
    return this.db!.executePutCommand('pin', entitites);
  }

  public async getPins(withType = false) {
    const fields = withType ? ['cid', 'type'] : ['cid'];
    const result = await this.db!.executeGetCommand('pin', fields);

    if (!result.ok) {
      throw new Error(result.message);
    }

    return result;
  }

  public async deletePins(pins: ParticleCid[]) {
    return this.db!.executeRmCommand(
      'pin',
      pins.map((cid) => ({ cid } as Partial<PinDbEntity>))
    );
  }

  public async putParticles(particles: ParticleDto[] | ParticleDto) {
    const entitites = transformListToDbEntity(
      Array.isArray(particles) ? particles : [particles]
    );
    await this.db!.executePutCommand('particle', entitites);
  }

  public async getParticles(fields: string[]) {
    const result = await this.db!.executeGetCommand('particle', fields);

    if (!result.ok) {
      throw new Error(result.message);
    }

    return result;
  }

  public async getSenseList() {
    const command = `
    ss_p[last_id, id, meta] := *sync_status{entry_type,id, last_id, meta}, entry_type=2

    p_last[last_id, id, meta, text, mime] := ss_p[last_id, id, meta], *particle{cid: last_id, text, mime}
    p_last[last_id, id, meta, empty, empty] := ss_p[last_id, id, meta], not *particle{cid: last_id, text, mime}, empty=''

    p_id[last_id, id, meta, text, mime] :=  ss_p[last_id, id, meta], *particle{cid: id, text, mime}
    p_id[last_id, id, meta, empty, empty] := ss_p[last_id, id, meta], not *particle{cid: id, text, mime}, empty=''

    p_last_m[last_id, id, m] :=  p_last[last_id, id, meta, text, mime], m= concat(meta, json_object('last_id', json_object('text', text, 'mime', mime)))

    p_join[last_id, id, m] :=  p_id[last_id, id, meta, text, mime], p_last_m[last_id, id, meta_prev], m= concat(meta, meta_prev, json_object('id', json_object('text', text, 'mime', mime)))

    ss_t[last_id, id, m] := *sync_status{entry_type,id, last_id, meta}, entry_type=1, *transaction{hash: last_id, value, type}, m= concat(meta, json_object('value', value, 'type', type))

    ?[entry_type, id, unread_count, timestamp_update, timestamp_read, last_id, meta] := *sync_status{entry_type, id, unread_count, timestamp_update, timestamp_read, last_id}, p_join[last_id, id, meta] or ss_t[last_id, id, meta]
    :order -timestamp_update
    `;

    const result = await this.db!.runCommand(command);

    return dbResultToDtoList(result).map((i) =>
      jsonifyFields(i, ['meta'])
    ) as SenseResult[];
  }

  public async getSenseSummary() {
    const command = `
    dt[entry_type, sum(unread_count)] := *sync_status{entry_type, unread_count}, entry_type=1
    dt[entry_type, sum(unread_count)] := *sync_status{entry_type, unread_count}, entry_type=2
    dt[entry_type, sum(unread_count)] := *sync_status{entry_type, unread_count}, entry_type=3
    ?[entry_type, unread] := dt[entry_type, unread]`;

    const result = await this.db!.runCommand(command);
    return dbResultToDtoList(result) as SenseUnread[];
  }

  public async senseMarkAsRead(id: NeuronAddress | ParticleCid) {
    const result = await this.db!.executeGetCommand(
      'sync_status',
      ['timestamp_update'],
      [`id = '${id}'`],
      ['id']
    );
    const timestampUpdate = result.rows[0];
    this.updateSyncStatus({
      id,
      timestampUpdate,
      timestampRead: timestampUpdate,
      unreadCount: 0,
    });
  }

  public async getTransactions(
    neuron: NeuronAddress,
    order: 'desc' | 'asc' = 'desc'
  ) {
    const result = await this.db!.executeGetCommand(
      'transaction',
      ['hash', 'type', 'success', 'value', 'timestamp', 'memo'],
      [`neuron = '${neuron}'`],
      ['neuron'],
      { orderBy: [order === 'desc' ? '-timestamp' : 'timestamp'] }
    );
    return dbResultToDtoList(result).map((i) =>
      jsonifyFields(i, ['value'])
    ) as TransactionDto[];
  }

  public async putCyberlinks(links: LinkDto[] | LinkDto) {
    const entitites = Array.isArray(links) ? links : [links];
    return this.db!.executePutCommand('link', entitites);
  }

  public async putSyncQueue(item: SyncQueueItem[] | SyncQueueItem) {
    const entitites = Array.isArray(item) ? item : [item];
    return this.db!.executePutCommand('sync_queue', entitites);
  }

  public async updateSyncQueue(
    item: Partial<SyncQueueDto>[] | Partial<SyncQueueDto>
  ) {
    const entitites = Array.isArray(item) ? item : [item];
    return this.db!.executeUpdateCommand('sync_queue', entitites);
  }

  public async removeSyncQueue(id: ParticleCid) {
    return this.db!.executeRmCommand('sync_queue', [{ id }]);
  }

  public async getSyncQueue({
    statuses,
    limit,
  }: {
    statuses: SyncQueueStatus[];
    limit?: number;
  }): Promise<SyncQueueDto[]> {
    const result = await this.db!.executeGetCommand(
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
  }

  public async getLinks(cid: ParticleCid) {
    const fields = [
      'mime',
      'text',
      'from',
      'to',
      'direction',
      'timestamp',
    ].join(', ');

    const command = `
    pf[${fields}] := *link{from, to,timestamp}, *particle{cid: from, text, mime}, direction='from'
    pf[${fields}] := *link{from, to,timestamp}, *particle{cid: to, text, mime}, direction='to'
    ?[${fields}] := pf[${fields}], from='${cid}' or to='${cid}'
    :order -timestamp`;
    const result = await this.db!.runCommand(command);
    return dbResultToDtoList(result);
  }
}

export default DbApiWrapper;
