import {
  BehaviorSubject,
  defer,
  Observable,
  filter,
  from,
  mergeMap,
  tap,
} from 'rxjs';
import { IDefferedDbProcessor } from 'src/services/QueueManager/types';
import { IPFSContent, IPFSContentMaybe } from 'src/services/ipfs/ipfs';

import { v4 as uuidv4 } from 'uuid';
import { ParticleCid } from 'src/types/base';
import { mapParticleToEntity } from 'src/services/CozoDb/mapping';
import DbApi from '../dataSource/indexedDb/dbApiWrapper';
import { LinkDto } from 'src/services/CozoDb/types/dto';

type QueueItem = {
  content?: IPFSContent;
  links?: LinkDto[];
};

type QueueMap = Map<ParticleCid | typeof uuidv4, QueueItem>;

class DeferredDbProcessor implements IDefferedDbProcessor {
  private queue$ = new BehaviorSubject<QueueMap>(new Map());

  private dbApi: DbApi | undefined;

  constructor(dbInstance$: Observable<DbApi | undefined>) {
    dbInstance$.subscribe((db) => {
      this.dbApi = db;
    });

    dbInstance$
      .pipe(
        filter((dbInstance) => !!dbInstance),
        tap(() => console.log('DeferredDbProcessor - initialized')),
        mergeMap(() => this.queue$), // Merge the queue$ stream here.
        filter((queue) => queue.size > 0),
        mergeMap((queue) => defer(() => from(this.processQueue(queue))))
      )
      .subscribe({
        // next: () => console.log('Queue processed'),
        error: (err) => console.error('Error processing IPFS queue', err),
      });
  }

  public enuqueIpfsContent(content: IPFSContentMaybe) {
    if (!content) {
      return;
    }
    const { cid } = content;
    this.queue$.next(new Map(this.queue$.value).set(cid, { content }));
  }

  public enqueueLinks(links: LinkDto[]) {
    if (!links || !links.length) {
      return;
    }
    const id = uuidv4();
    this.queue$.next(new Map(this.queue$.value).set(id, { links }));
  }

  private async processQueue(queue: QueueMap) {
    // const processingQueue = new Map(this.queue$.value); // Snapshot of the current queue
    this.queue$.next(new Map());

    // eslint-disable-next-line no-restricted-syntax
    for (const [cid, item] of queue) {
      // eslint-disable-next-line no-await-in-loop
      await this.processQueueItem(item);
      // console.log(' deffered DB done ', cid, item);

      queue.delete(cid);
    }
    // this.queue$.next(queue);
  }

  private async processQueueItem(queueItem: QueueItem) {
    const { content, links } = queueItem;
    // console.log(`PostProcessing queue item: ${cid}`, item);
    if (content) {
      // eslint-disable-next-line no-await-in-loop
      const entity = mapParticleToEntity(content);
      await this.dbApi!.putParticles(entity);
    }

    if (links) {
      // eslint-disable-next-line no-await-in-loop
      await this.dbApi!.putCyberlinks(links);
    }
  }
}

export default DeferredDbProcessor;
