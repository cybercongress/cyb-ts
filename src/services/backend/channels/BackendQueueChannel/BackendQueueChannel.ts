import { BehaviorSubject, first } from 'rxjs';
import { LinkDto } from 'src/services/CozoDb/types/dto';
import { IPFSContent } from 'src/services/ipfs/types';
import { mapParticleToEntity } from 'src/services/CozoDb/mapping';
import { QueueChannelMessage } from './types';
import { CYB_QUEUE_CHANNEL } from '../consts';

import { enqueueParticleEmbeddingMaybe } from './backendQueueSenders';
import ParticlesResolverQueue from '../../services/sync/services/ParticlesResolverQueue/ParticlesResolverQueue';
import DbApi from '../../services/DbApi/DbApi';

import { SyncQueueItem } from '../../services/sync/services/ParticlesResolverQueue/types';

class BackendQueueChannelListener {
  private channel = new BroadcastChannel(CYB_QUEUE_CHANNEL);

  private particlesResolver: ParticlesResolverQueue;

  private dbInstance$: BehaviorSubject<DbApi | undefined>;

  constructor(
    particlesResolver: ParticlesResolverQueue,
    dbInstance$: BehaviorSubject<DbApi | undefined>
  ) {
    this.particlesResolver = particlesResolver;
    this.dbInstance$ = dbInstance$;

    this.channel.onmessage = (event) => this.onMessage(event);

    this.channel.onmessageerror = (event) =>
      console.error(`${CYB_QUEUE_CHANNEL} error`, event);
  }

  private async getDeffredDbApi(): Promise<DbApi> {
    return new Promise((resolve) => {
      const dbApi = this.dbInstance$.getValue();
      if (dbApi) {
        resolve(dbApi);
      }

      this.dbInstance$
        .pipe(
          first((value) => value !== undefined) // Automatically unsubscribes after the first valid value
        )
        .subscribe((value) => {
          resolve(value as DbApi);
        });
    });
  }

  private async saveLinks(links: LinkDto[]) {
    const dbApi = await this.getDeffredDbApi();
    const res = await dbApi.putCyberlinks(links);
    // console.log('---saveLinks done', links, res);
  }

  private async saveParticles(content: IPFSContent) {
    const dbApi = await this.getDeffredDbApi();
    const entity = mapParticleToEntity(content);
    const result = await dbApi.putParticles(entity);
    if (result.ok) {
      await enqueueParticleEmbeddingMaybe(content);
    }
    // console.log('---saveParticles done', content);
  }

  private async enquueSync(data: SyncQueueItem | SyncQueueItem[]) {
    // TODO: TMP ASYNC WAIT TO INIT DB
    await this.getDeffredDbApi();

    this.particlesResolver.enqueue(Array.isArray(data) ? data : [data]);
  }

  private onMessage(msg: MessageEvent<QueueChannelMessage>) {
    const { type, data } = msg.data;
    if (type === 'link') {
      this.saveLinks(data);
    } else if (type === 'particle') {
      this.saveParticles(data);
    } else if (type === 'sync') {
      this.enquueSync(data);
    }
  }
}

export default BackendQueueChannelListener;
