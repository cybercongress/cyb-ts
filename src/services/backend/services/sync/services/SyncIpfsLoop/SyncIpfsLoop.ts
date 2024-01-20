import { Observable, defer, from, map, combineLatest } from 'rxjs';
import BroadcastChannelSender from 'src/services/backend/channels/BroadcastChannelSender';
import { broadcastStatus } from 'src/services/backend/channels/broadcastStatus';
import { CybIpfsNode } from 'src/services/ipfs/ipfs';
import { mapPinToEntity } from 'src/services/CozoDb/mapping';
import { QueuePriority } from 'src/services/QueueManager/types';

import DbApi from '../../../dataSource/indexedDb/dbApiWrapper';

import { ServiceDeps } from '../types';
import { createLoopObservable } from '../utils/rxjs';
import { IPFS_SYNC_INTERVAL } from '../consts';
import { fetchPins } from '../../../dataSource/ipfs/ipfsSource';
import ParticlesResolverQueue from '../ParticlesResolverQueue/ParticlesResolverQueue';

class SyncIpfsLoop {
  private isInitialized$: Observable<boolean>;

  private db: DbApi | undefined;

  private ipfsNode: CybIpfsNode | undefined;

  private particlesResolver: ParticlesResolverQueue | undefined;

  private statusApi = broadcastStatus('pin', new BroadcastChannelSender());

  private _loop$: Observable<any> | undefined;

  public get loop$(): Observable<any> | undefined {
    return this._loop$;
  }

  constructor(deps: ServiceDeps, particlesResolver: ParticlesResolverQueue) {
    deps.dbInstance$.subscribe((db) => {
      this.db = db;
    });

    deps.ipfsInstance$.subscribe((ipfsInstance) => {
      this.ipfsNode = ipfsInstance;
    });

    this.particlesResolver = particlesResolver;

    // this.isInitialized$ = isInitialized$;

    this.isInitialized$ = combineLatest([
      deps.dbInstance$,
      deps.ipfsInstance$,
      particlesResolver.isInitialized$,
    ]).pipe(
      map(
        ([dbInstance, ipfsInstance, syncQueueInitialized]) =>
          !!ipfsInstance && !!dbInstance && !!syncQueueInitialized
      )
    );
  }

  start() {
    this._loop$ = createLoopObservable(
      IPFS_SYNC_INTERVAL,
      this.isInitialized$,
      defer(() => from(this.syncPins())),
      () => this.statusApi.sendStatus('in-progress')
    );

    this._loop$.subscribe({
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
        await this.particlesResolver!.enqueue(
          particlesToAdd.map((cid) => ({
            id: cid,
            priority: QueuePriority.LOW,
          }))
        );
      }

      if (pinsToAdd.length > 0) {
        await this.db!.putPins(pinsToAdd.map(mapPinToEntity));
      }
    } catch (e) {
      console.log('---syncPins error', e);
      throw e;
    }
  }
}

export default SyncIpfsLoop;
