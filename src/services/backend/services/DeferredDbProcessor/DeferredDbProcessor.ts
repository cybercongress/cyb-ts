import {
  BehaviorSubject,
  concatMap,
  defer,
  filter,
  from,
  mergeMap,
  tap,
} from 'rxjs';
import { IDefferedDbProcessor } from 'src/services/QueueManager/types';
import { IPFSContent, IPFSContentMaybe } from 'src/services/ipfs/ipfs';
import {
  importParicleContent,
  // importParticle,
  // importParticles,
} from '../dataSource/ipfs/ipfsSource';
import { DbApi } from '../dataSource/indexedDb/dbApiWrapper';
import { v4 as uuidv4 } from 'uuid';
import { LinkDbEntity } from 'src/services/CozoDb/types';
import { ParticleCid } from 'src/types/base';

type QueueItem = {
  content?: IPFSContent;
  links?: LinkDbEntity[];
};

class DeferredDbProcessor implements IDefferedDbProcessor {
  private queue$ = new BehaviorSubject<
    Map<ParticleCid | typeof uuidv4, QueueItem>
  >(new Map());

  private isInitialized$ = new BehaviorSubject(false);

  private dbApi: DbApi | undefined;

  constructor() {
    this.isInitialized$
      .pipe(
        filter((isInitialized) => isInitialized === true),
        tap(() => console.log('DeferredDbProcessor Initialized')),
        mergeMap(() => this.queue$), // Merge the queue$ stream here.
        filter((queue) => queue.size > 0),
        mergeMap(() => defer(() => from(this.processQueue())))
      )
      .subscribe({
        // next: () => console.log('Queue processed'),
        error: (err) => console.error('Error processing IPFS queue', err),
      });
  }

  public init(dbApi: DbApi) {
    this.dbApi = dbApi;
    this.isInitialized$.next(true);
  }

  public enuqueIpfsContent(content: IPFSContentMaybe) {
    if (!content) {
      return;
    }
    const { cid } = content;
    const queue = this.queue$.value;
    queue.set(cid, { content });
    this.queue$.next(queue);
  }

  public enqueueLinks(links: LinkDbEntity[]) {
    if (!links || !links.length) {
      return;
    }
    const queue = this.queue$.value;

    const id = uuidv4();

    queue.set(id, { links });

    this.queue$.next(queue);
  }

  private async processQueue() {
    const queue = this.queue$.value;
    // console.log('---POSTPROCESSING QUEUE', queue);

    // eslint-disable-next-line no-restricted-syntax
    for (const [cid, item] of queue) {
      this.processQueueItem(item);
      queue.delete(cid);
    }
    this.queue$.next(queue);
  }

  private async processQueueItem(queueItem: QueueItem) {
    const { content, links } = queueItem;
    // console.log(`PostProcessing queue item: ${cid}`, item);
    if (content) {
      // eslint-disable-next-line no-await-in-loop
      await importParicleContent(content, this.dbApi!);
    }

    if (links) {
      // eslint-disable-next-line no-await-in-loop
      await this.dbApi!.putCyberlinks(links);
    }
  }
}

export default DeferredDbProcessor;
