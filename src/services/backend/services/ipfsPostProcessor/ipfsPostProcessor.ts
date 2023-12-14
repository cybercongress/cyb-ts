import { BehaviorSubject, concatMap, filter, from } from 'rxjs';
import { IIpfsQueuePostProcessor } from 'src/services/QueueManager/types';
import { IPFSContent, IPFSContentMaybe } from 'src/services/ipfs/ipfs';
import { importParicleContent } from '../dataSource/ipfs/ipfsSource';
import { DbApi } from '../dataSource/indexedDb/dbApiWrapper';

type QueueMap = Map<string, IPFSContent>;

class IpfsPostProcessor implements IIpfsQueuePostProcessor {
  private queue$ = new BehaviorSubject<QueueMap>(new Map());

  private isInitialized$ = new BehaviorSubject(false);

  private dbApi: DbApi | undefined;

  constructor() {
    this.isInitialized$
      .pipe(
        filter((isInitialized) => isInitialized === true),
        concatMap(() => from(this.processQueue()))
      )
      .subscribe({
        next: () => console.log('Queue processed'),
        error: (err) => console.error('Error processing IPFS queue', err),
      });
  }

  public init(dbApi: DbApi) {
    this.dbApi = dbApi;
    this.isInitialized$.next(true);
  }

  public euqueProcessing(content: IPFSContentMaybe) {
    if (!content) {
      return;
    }
    const { cid } = content;
    const queue = this.queue$.value;
    queue.set(cid, content);
    this.queue$.next(queue);
  }

  private async processQueue() {
    const queue = this.queue$.value;
    // eslint-disable-next-line no-restricted-syntax
    for (const [cid, content] of queue) {
      console.log(`PostProcessing item with cid: ${content.cid}`, content);
      // eslint-disable-next-line no-await-in-loop
      await importParicleContent(content, this.dbApi!);
      queue.delete(cid);
    }
    this.queue$.next(queue);
  }
}

export default IpfsPostProcessor;
