import DeferredDbSaver from './DeferredDbSaver';
import DbApi from '../dataSource/indexedDb/dbApiWrapper';
import { IPFSContent } from 'src/services/ipfs/ipfs';

describe('DeferredDbSaver', () => {
  let deferredDbProcessor: DeferredDbSaver;
  let dbApiMock: jest.Mocked<DbApi>;

  beforeEach(() => {
    dbApiMock = {
      putParticles: jest.fn(),
      putCyberlinks: jest.fn(),
    } as jest.Mocked<DbApi>;

    deferredDbProcessor = new DeferredDbSaver();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should enqueue IPFS content', () => {
    const content: IPFSContent = {
      cid: 'Qm1234567890',
      textPreview: 'Hello, World!',
      source: 'node',
      meta: { size: 123, mime: 'text/plain', type: 'file' },
    };
    deferredDbProcessor.enqueueIpfsContent(content);
    deferredDbProcessor.enqueueIpfsContent({ ...content, cid: 'Qm1111' });

    const queue = deferredDbProcessor['queue$'].getValue();
    expect(queue.size).toBe(2);

    const queueItem = queue.get(content?.cid);
    expect(queueItem).toBeDefined();
    deferredDbProcessor.init(dbApiMock);
    expect(queue.size).toBe(0);
  });
});
