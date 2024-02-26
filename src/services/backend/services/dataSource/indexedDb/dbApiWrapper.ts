import {
  EntryType,
  PinDbEntity,
  TransactionDbEntity,
  SyncQueueStatus,
  LinkDbEntity,
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
  CommunityDto,
  LinkDto,
  ParticleDto,
  SyncQueueDto,
  SyncStatusDto,
  TransactionDto,
} from 'src/services/CozoDb/types/dto';

import {
  SenseListItem,
  SenseUnread,
  SenseMetaType,
} from 'src/services/backend/types/sense';
import { SyncQueueItem } from '../../sync/services/ParticlesResolverQueue/types';
import { extractSenseChats } from '../../sync/services/utils/sense';
import {
  MSG_MULTI_SEND_TRANSACTION_TYPE,
  MSG_SEND_TRANSACTION_TYPE,
} from '../../indexer/types';

const TIMESTAMP_INTITAL = 0;

class DbApiWrapper {
  private db: CozoDbWorker | undefined;

  public init(dbApi: CozoDbWorker) {
    this.db = dbApi;
    return this;
  }

  public async getSyncStatus(
    ownerId: NeuronAddress,
    id: NeuronAddress | ParticleCid,
    entryType: EntryType | EntryType[]
  ) {
    const result = await this.db!.executeGetCommand(
      'sync_status',
      ['timestamp_update', 'unread_count', 'timestamp_read'],
      [
        `id = '${id}'`,
        `owner_id = '${ownerId}'`,
        `entry_type in [${
          Array.isArray(entryType) ? entryType.join(', ') : entryType
        }]`,
      ],
      ['id', 'owner_id', 'entry_type']
    );

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

    return result;
  }

  public async updateSyncStatus(
    entity: Partial<SyncStatusDto> & {
      id: NeuronAddress | ParticleCid;
      ownerId: NeuronAddress;
    }
  ) {
    return this.db!.executeUpdateCommand('sync_status', [
      transformToDbEntity(removeUndefinedFields(entity)),
    ]);
  }

  public async findSyncStatus({
    ownerId,
    entryType,
    id,
  }: {
    ownerId: NeuronAddress;
    entryType?: EntryType[] | EntryType;
    id?: NeuronAddress | ParticleCid;
  }) {
    const conditions = [`owner_id = '${ownerId}'`];

    entryType &&
      conditions.push(
        `entry_type in [${
          Array.isArray(entryType) ? entryType.join(', ') : entryType
        }]`
      );

    id && conditions.push(`id = '${id}'`);

    const result = await this.db!.executeGetCommand(
      'sync_status',
      ['id', 'unread_count', 'timestamp_update', 'timestamp_read', 'meta'],
      conditions,
      ['entry_type', 'owner_id'],
      { orderBy: ['-timestamp_update'] }
    );

    return dbResultToDtoList(result) as SyncStatusDto[];
  }

  public async putTransactions(transactions: TransactionDbEntity[]) {
    return this.db!.executePutCommand('transaction', transactions);
  }

  public async putPins(pins: PinDbEntity[] | PinDbEntity) {
    const entitites = Array.isArray(pins) ? pins : [pins];
    return this.db!.executePutCommand('pin', entitites);
  }

  public async getPins(withType = false) {
    const fields = withType ? ['cid', 'type'] : ['cid'];
    const result = await this.db!.executeGetCommand('pin', fields);

    return result;
  }

  public async getCommunity(ownerId: NeuronAddress) {
    const result = await this.db!.executeGetCommand('community', undefined, [
      `owner_id = '${ownerId}'`,
    ]);

    return dbResultToDtoList(result) as CommunityDto[];
  }

  public async putCommunity(community: CommunityDto[] | CommunityDto) {
    const entitites = transformListToDbEntity(
      Array.isArray(community) ? community : [community]
    );
    await this.db!.executePutCommand('community', entitites);
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

    return result;
  }

  public async getSenseList(myAddress: NeuronAddress = '') {
    const command = `
    ss_particles[id, meta] := *sync_status{entry_type,id, meta, owner_id}, entry_type=${EntryType.particle}, owner_id = '${myAddress}'

    ss_chat_all[id, meta, hash, is_link] := *sync_status{entry_type, id, meta, owner_id}, entry_type=${EntryType.chat}, hash=maybe_get(meta, 'transaction_hash'), is_link=!is_null(maybe_get(meta, 'to')), owner_id = '${myAddress}'
    ss_chat_links[id, meta] := ss_chat_all[id, meta, hash, is_link], is_link
    ss_chat_trans[id, m] := ss_chat_all[id, meta, hash, is_link], !is_link, *transaction{hash, index, value, type, timestamp, success, memo},  m=concat(meta, json_object('value', value, 'type', type, 'timestamp', timestamp, 'memo', memo, 'success', success, 'index', index))

    ?[owner_id, entry_type, id, unread_count, timestamp_update, timestamp_read, meta] := *sync_status{entry_type, id, unread_count, timestamp_update, timestamp_read, owner_id}, ss_particles[id, meta] or ss_chat_links[id, meta] or ss_chat_trans[id, meta], id!='${myAddress}', owner_id = '${myAddress}'
    :order -timestamp_update
    `;

    const result = await this.db!.runCommand(command, true);
    const senseList = dbResultToDtoList(result).map((i) =>
      jsonifyFields(i, ['meta'])
    ) as SenseListItem[];

    // console.log('-------cmd', senseList);
    console.log('!=!=! redundant calls - FIX');
    return senseList;
  }

  // public async getSenseSummary(myAddress: NeuronAddress = '') {
  //   const command = `
  //   r[entry_type, sum(unread_count)] := *sync_status{id, entry_type, unread_count}, id!='${myAddress}'
  //   ?[entry_type, unread_count] :=r[entry_type, unread_count]
  //   `;

  //   const result = await this.db!.runCommand(command);
  //   return dbResultToDtoList(result) as SenseUnread[];
  // }

  public async senseMarkAsRead(
    ownerId: NeuronAddress,
    id: NeuronAddress | ParticleCid
  ) {
    // console.time(`---senseMarkAsRead done ${id}`);
    const result = await this.db!.executeGetCommand(
      'sync_status',
      ['timestamp_update'],
      [`id = '${id}'`, `owner_id = '${ownerId}'`],
      ['id', 'owner_id']
    );

    const timestampUpdate = result.rows[0][0] as number;

    const res = this.updateSyncStatus({
      id,
      ownerId,
      timestampUpdate,
      timestampRead: timestampUpdate,
      unreadCount: 0,
    });

    // console.timeEnd(`---senseMarkAsRead done ${id}`);
    return res;
  }

  public async getTransactions(
    neuron: NeuronAddress,
    {
      timestampFrom = 0,
      order = 'desc',
    }: { order?: 'desc' | 'asc'; timestampFrom?: number } = {}
  ) {
    const conditions = [
      `neuron = '${neuron}'`,
      `timestamp >= ${timestampFrom}`,
    ];
    const result = await this.db!.executeGetCommand(
      'transaction',
      ['hash', 'type', 'success', 'value', 'timestamp', 'memo'],
      conditions,
      ['neuron'],
      { orderBy: [order === 'desc' ? '-timestamp' : 'timestamp'] }
    );
    return dbResultToDtoList(result).map((i) =>
      jsonifyFields(i, ['value'])
    ) as TransactionDto[];
  }

  public async getMyChats(
    myAddress: NeuronAddress,
    userAddress: NeuronAddress
  ) {
    const result = await this.db!.executeGetCommand(
      'transaction',
      ['hash', 'type', 'success', 'value', 'timestamp', 'memo'],
      [
        `neuron = '${myAddress}', type='${MSG_SEND_TRANSACTION_TYPE}' or type='${MSG_MULTI_SEND_TRANSACTION_TYPE}'`,
      ],
      ['neuron'],
      { orderBy: ['timestamp'] }
    );
    const sendTransactions = dbResultToDtoList(result).map((i) =>
      jsonifyFields(i, ['value'])
    ) as TransactionDto[];

    const chats = extractSenseChats(myAddress, sendTransactions);
    const userChats = [...chats.values()].find(
      (c) => c.userAddress === userAddress
    );

    return userChats ? userChats.transactions : [];
  }

  public async putCyberlinks(links: LinkDbEntity[] | LinkDbEntity) {
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

    return result.rows.map((row) => ({
      id: row[0] as string,
      status: row[1] as SyncQueueStatus,
      priority: row[2] as number,
    }));
  }

  public async getLinks({
    cid,
    neuron,
  }: {
    cid?: ParticleCid;
    neuron?: NeuronAddress;
  }) {
    const conditions = [];
    cid && conditions.push(`from='${cid}' or to='${cid}'`);
    neuron && conditions.push(`neuron='${neuron}'`);

    const result = await this.db!.executeGetCommand(
      'link',
      ['from', 'to', 'timestamp', 'neuron', 'transaction_hash'],
      conditions,
      [],
      { orderBy: ['timestamp'] }
    );

    return dbResultToDtoList(result) as LinkDto[];
  }
}

export default DbApiWrapper;
