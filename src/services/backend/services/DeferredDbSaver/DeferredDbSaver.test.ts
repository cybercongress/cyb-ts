import DeferredDbSaver from './DeferredDbSaver';
import DbApi from '../dataSource/indexedDb/dbApiWrapper';
import { IPFSContent } from 'src/services/ipfs/ipfs';
import { BehaviorSubject, of } from 'rxjs';

const nextTick = () => {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
};

describe('DeferredDbSaver', () => {
  const dbApiMock$: BehaviorSubject<DbApi | undefined> = new BehaviorSubject(
    undefined
  );

  // beforeEach(() => {
  //   dbApiMock = {
  //     putParticles: jest.fn(),
  //     putCyberlinks: jest.fn(),
  //   } as jest.Mocked<DbApi>;

  //   deferredDbSaver = new DeferredDbSaver(of(dbApiMock));
  // });

  // afterEach(() => {
  //   jest.clearAllMocks();
  // });
  const deferredDbSaver = new DeferredDbSaver(dbApiMock$);

  it('should enqueue IPFS content', async () => {
    const content: IPFSContent = {
      cid: 'Qm1234567890',
      textPreview: 'Hello, World!',
      source: 'node',
      meta: { size: 123, mime: 'text/plain', type: 'file' },
    };
    deferredDbSaver.enqueueIpfsContent(content);
    deferredDbSaver.enqueueIpfsContent({ ...content, cid: 'Qm1111' });

    expect(deferredDbSaver.queue.size).toBe(2);

    const queueItem = deferredDbSaver.queue.get(content?.cid);
    expect(queueItem).toBeDefined();

    dbApiMock$.next({} as DbApi);

    expect(deferredDbSaver.queue.size).toBe(0);
    return Promise.resolve();
  });
});
