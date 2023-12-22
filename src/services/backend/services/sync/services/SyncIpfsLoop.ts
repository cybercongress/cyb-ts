import {
  BehaviorSubject,
  Observable,
  defer,
  filter,
  mergeMap,
  tap,
  from,
  map,
  combineLatest,
} from 'rxjs';
import BroadcastChannelSender, {
  broadcastStatus,
} from 'src/services/backend/channels/BroadcastChannelSender';
import { DbApi } from '../../dataSource/indexedDb/dbApiWrapper';

import { ServiceDeps } from './types';
import { CybIpfsNode } from 'src/services/ipfs/ipfs';
import { createLoopObservable } from './utils';
import { IPFS_SYNC_INTERVAL } from './consts';
import { fetchPins } from '../../dataSource/ipfs/ipfsSource';
import { mapPinToEntity } from 'src/services/CozoDb/mapping';
import SyncQueue from './SyncQueue';

class SyncIpfsLoop {
  private isInitialized$: Observable<boolean>;

  private db: DbApi | undefined;

  private ipfsNode: CybIpfsNode | undefined;

  private syncQueue: SyncQueue | undefined;

  private statusApi = broadcastStatus('pin', new BroadcastChannelSender());

  constructor(deps: ServiceDeps, syncQueue: SyncQueue) {
    deps.dbInstance$.subscribe((db) => {
      this.db = db;
    });

    deps.ipfsInstance$.subscribe((ipfsInstance) => {
      this.ipfsNode = ipfsInstance;
    });

    this.syncQueue = syncQueue;

    // this.isInitialized$ = isInitialized$;

    this.isInitialized$ = combineLatest([
      deps.dbInstance$,
      deps.ipfsInstance$,
      syncQueue.isInitialized$,
    ]).pipe(
      map(
        ([dbInstance, ipfsInstance, syncQueueInitialized]) =>
          !!ipfsInstance && !!dbInstance && !!syncQueueInitialized
      )
    );
  }

  start() {
    createLoopObservable(
      IPFS_SYNC_INTERVAL,
      defer(() => from(this.syncPins())),
      this.isInitialized$,
      () => this.statusApi.sendStatus('in-progress')
    ).subscribe({
      next: (result) => this.statusApi.sendStatus('idle'),
      error: (err) => this.statusApi.sendStatus('error', err.toString()),
    });

    return this;
  }

  private async syncPins() {
    try {
      const pinsResult = await fetchPins(this.ipfsNode!);
      // console.log('---syncPins pinsResult', pinsResult);
      const dbPins = (await this.db!.getPins()).rows.map(
        (row) => row[0] as string
      );

      const pinsResultSet = new Set(
        pinsResult.map((pin) => pin.cid.toString())
      );
      const dbPinsSet = new Set(dbPins);

      // Find and exclude overlapping pins
      const pinsToRemove = dbPins.filter((pin) => !pinsResultSet.has(pin));

      const pinsToAdd = pinsResult.filter(
        (pin) => !dbPinsSet.has(pin.cid.toString())
      );

      if (pinsToRemove.length) {
        await this.db!.deletePins(pinsToRemove);
      }

      const particlesExist = new Set(
        (await this.db!.getParticles(['cid'])).rows.map(
          (row) => row[0] as string
        )
      );

      const cidsToAdd = pinsToAdd.map((pin) => pin.cid.toString());

      const particlesToAdd = cidsToAdd.filter(
        (cid) => !particlesExist.has(cid)
      );

      if (particlesToAdd.length > 0) {
        await this.syncQueue!.pushToSyncQueue(
          particlesToAdd.map((cid) => ({ id: cid, priority: 1 }))
        );
      }

      if (pinsToAdd.length > 0) {
        await this.db!.putPins(pinsToAdd.map(mapPinToEntity));
      }
    } catch (e) {
      console.log('---syncPins error', e);
    }
  }
}

export default SyncIpfsLoop;
