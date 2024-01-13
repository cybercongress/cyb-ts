/* eslint-disable camelcase */
import { Observable, defer, from, map, combineLatest } from 'rxjs';
import BroadcastChannelSender from 'src/services/backend/channels/BroadcastChannelSender';
import { broadcastStatus } from 'src/services/backend/channels/broadcastStatus';
import { EntryType } from 'src/services/CozoDb/types/entities';
import { mapTransactionToEntity } from 'src/services/CozoDb/mapping';
import { dateToNumber } from 'src/utils/date';
import { NeuronAddress } from 'src/types/base';
import { QueuePriority } from 'src/services/QueueManager/types';
import { SyncStatusDto } from 'src/services/CozoDb/types/dto';

import DbApi from '../../../dataSource/indexedDb/dbApiWrapper';

import { ServiceDeps } from '../types';
import { fetchCyberlinksAndResolveParticles } from '../utils/links';
import { createLoopObservable } from '../utils/rxjs';
import {
  BLOCKCHAIN_SYNC_INTERVAL,
  MAX_PARRALEL_TRANSACTIONS,
  SENSE_TRANSACTIONS,
} from '../consts';
import ParticlesResolverQueue from '../ParticlesResolverQueue/ParticlesResolverQueue';
import { changeSyncStatus } from '../../utils';
import { extractCybelinksFromTransaction } from '../utils/links';
import { SyncServiceParams } from '../../types';

import { fetchTransactionsIterable } from '../../../dataSource/blockchain/requests';
import { Transaction } from '../../../dataSource/blockchain/types';
import { syncMyChats } from './services/chat';

class SyncTransactionsLoop {
  private isInitialized$: Observable<boolean>;

  private db: DbApi | undefined;

  private particlesResolver: ParticlesResolverQueue | undefined;

  private _loop$: Observable<any> | undefined;

  public get loop$(): Observable<any> | undefined {
    return this._loop$;
  }

  private statusApi = broadcastStatus(
    'transaction',
    new BroadcastChannelSender()
  );

  private params: SyncServiceParams = {
    myAddress: null,
    followings: [],
  };

  constructor(deps: ServiceDeps, particlesResolver: ParticlesResolverQueue) {
    if (!deps.params$) {
      throw new Error('params$ is not defined');
    }

    this.particlesResolver = particlesResolver;

    deps.dbInstance$.subscribe((db) => {
      this.db = db;
    });

    deps.params$.subscribe((params) => {
      this.params = params;
    });

    // this.isInitialized$ = isInitialized$;

    this.isInitialized$ = combineLatest([
      deps.dbInstance$,
      deps.params$,
      particlesResolver.isInitialized$,
    ]).pipe(
      map(
        ([dbInstance, params, syncQueueInitialized]) =>
          !!dbInstance &&
          !!syncQueueInitialized &&
          !!params.cyberIndexUrl &&
          !!params.myAddress
      )
    );
  }

  start() {
    this._loop$ = createLoopObservable(
      BLOCKCHAIN_SYNC_INTERVAL,
      this.isInitialized$,
      defer(() => from(this.syncAllTransactions())),
      () => this.statusApi.sendStatus('in-progress')
    );

    this._loop$.subscribe({
      next: (result) => this.statusApi.sendStatus('idle'),
      error: (err) => this.statusApi.sendStatus('error', err.toString()),
    });

    return this;
  }

  private async syncAllTransactions() {
    try {
      if (this.params.myAddress) {
        await this.syncTransactions(this.params.myAddress, true);
        this.statusApi.sendStatus('in-progress', `sync my chats`);
        await syncMyChats(this.db!, this.params.myAddress);
        this.statusApi.sendStatus('idle');
      }

      // TODO: Enable to full sync of transactions
      // await Promise.all(
      //   this.params.followings.map((addr) => this.syncTransactions(addr))
      // );
    } catch (err) {
      console.error('>>> syncAllTransactions', err);
      throw err;
    }
  }

  public async syncTransactions(
    address: NeuronAddress,
    addCyberlinksToSync = false
  ) {
    this.statusApi.sendStatus('in-progress', `sync ${address}...`);

    const { timestampRead, unreadCount, timestampUpdate } =
      await this.db!.getSyncStatus(address);

    const transactionsAsyncIterable = fetchTransactionsIterable(
      this.params.cyberIndexUrl!,
      address,
      timestampUpdate + 1 // ofsset + 1 to fix milliseconds precision bug
    );

    let count = 0;

    let lastTransaction: Transaction | undefined;
    // eslint-disable-next-line no-restricted-syntax
    for await (const batch of transactionsAsyncIterable) {
      // filter only supported transactions

      const items = batch.filter((t) => SENSE_TRANSACTIONS.includes(t.type));

      console.log(
        '--------syncTransactions start',
        address,
        items.length,
        items.at(0)?.transaction.block.timestamp
      );
      if (items.length > 0) {
        // pick last transaction = first item based on request orderby
        if (!lastTransaction) {
          lastTransaction = items.at(0)!;
        }

        const transactions = items.map((i) =>
          mapTransactionToEntity(address, i)
        );
        // console.log('---syncTransactions putTransactions ', transactions);
        count += items.length;
        await this.db!.putTransactions(transactions);

        this.statusApi.sendStatus(
          'in-progress',
          `sync ${address} batch processing...`
        );
        const { tweets, particlesFound, links } =
          extractCybelinksFromTransaction(items);

        const tweetCids = Object.keys(tweets);

        // resolve 'tweets' particles
        await this.particlesResolver!.enqueue(
          tweetCids.map((cid) => ({
            id: cid /* from is tweet */,
            priority: QueuePriority.HIGH,
          }))
        );

        // Add cyberlink to sync observables
        if (addCyberlinksToSync && links.length > 0) {
          await this.db!.putCyberlinks(
            links.map((link) => ({ ...link, neuron: '' }))
          );

          if (particlesFound.length > 0) {
            await this.particlesResolver!.enqueue(
              particlesFound.map((cid) => ({
                id: cid,
                priority: QueuePriority.LOW,
              }))
            );
          }
          const batchSize = MAX_PARRALEL_TRANSACTIONS;
          for (let i = 0; i < tweetCids.length; i += batchSize) {
            const batch = tweetCids.slice(i, i + batchSize);
            // eslint-disable-next-line no-await-in-loop
            const syncStatusEntities = await Promise.all(
              batch.map(async (cid) => {
                const { timestamp, direction, from, to } = tweets[cid];

                // Initial state
                const syncStatus = {
                  id: cid as string,
                  entryType: EntryType.particle,
                  timestampUpdate: timestamp,
                  timestampRead: timestamp,
                  unreadCount: 0,
                  lastId: direction === 'from' ? from : to,
                  disabled: false,
                  meta: { direction },
                } as SyncStatusDto;

                const links = await fetchCyberlinksAndResolveParticles(
                  this.params!.cyberIndexUrl!,
                  cid,
                  timestamp,
                  this.particlesResolver!,
                  QueuePriority.HIGH
                );

                return links.length > 0
                  ? changeSyncStatus(syncStatus, links)
                  : syncStatus;
              })
            );
            if (syncStatusEntities.length > 0) {
              this.db!.putSyncStatus(syncStatusEntities);
            }
          }
        }
      }
    }

    const unreadTransactionsCount = unreadCount + count;

    if (lastTransaction) {
      // Update transaction
      this.db!.putSyncStatus({
        entryType: EntryType.transactions,
        id: address,
        timestampUpdate: dateToNumber(
          lastTransaction.transaction.block.timestamp
        ),
        unreadCount: unreadTransactionsCount,
        timestampRead,
        disabled: false,
        lastId: lastTransaction.transaction_hash,
        meta: { memo: lastTransaction?.transaction?.memo || '' },
      });
    }
  }
}

export default SyncTransactionsLoop;
