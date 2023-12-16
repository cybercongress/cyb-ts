// eslint-disable-next-line import/no-unused-modules
import { IPFSContent } from 'src/services/ipfs/ipfs';
import { LinkDbEntity } from 'src/services/CozoDb/types';

import DeferredDbProcessor from './DeferredDbProcessor';
import { DbApi } from '../dataSource/indexedDb/dbApiWrapper';

describe('DeferredDbProcessor', () => {
  let deferredDbProcessor: DeferredDbProcessor;

  let dbApiMock: jest.Mocked<DbApi>;

  beforeEach(() => {
    dbApiMock = {
      putParticles: jest.fn(),
      putCyberlinks: jest.fn(),
    } as jest.Mocked<DbApi>;

    deferredDbProcessor = new DeferredDbProcessor();
    deferredDbProcessor.init(dbApiMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should enqueue IPFS content', () => {
    // ... test code ...

    // Mock the processQueueItem method
    jest
      .spyOn(deferredDbProcessor as any, 'processQueueItem')
      .mockImplementation((item) => console.log(item));

    // ... assertion and test code ...
  });

  it('should enqueue links', () => {
    // ... test code ...

    // Mock the processQueueItem method
    jest
      .spyOn(deferredDbProcessor as any, 'processQueueItem')
      .mockImplementation((item) => console.log(item));

    // ... assertion and test code ...
  });

  it('should process the queue', async () => {
    // ... test code ...

    // Mock the processQueueItem method
    jest
      .spyOn(deferredDbProcessor as any, 'processQueueItem')
      .mockImplementation((item) => console.log(item));

    // ... assertion and test code ...
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

it('should enqueue IPFS content', () => {
  const content: IPFSContent = {
    /* create IPFS content object */
  };
  deferredDbProcessor.enqueueIpfsContent(content);

  // Assert that the content is enqueued correctly
  const queue = deferredDbProcessor['queue$'].getValue();
  expect(queue.size).toBe(1);
  expect(queue.get(content.cid)).toEqual({ content });
});

it('should enqueue links', () => {
  const links: LinkDbEntity[] = [
    /* create link objects */
  ];
  deferredDbProcessor.enqueueLinks(links);

  // Assert that the links are enqueued correctly
  const queue = deferredDbProcessor['queue$'].getValue();
  expect(queue.size).toBe(1);
  expect(queue.get(links[0].cid)).toEqual({ links });
});

it('should process the queue', async () => {
  const content: IPFSContent = {
    /* create IPFS content object */
  };
  const links: LinkDbEntity[] = [
    /* create link objects */
  ];
  deferredDbProcessor.enqueueIpfsContent(content);
  deferredDbProcessor.enqueueLinks(links);

  // Mock the processQueue method to test its behavior
  jest.spyOn(deferredDbProcessor as any, 'processQueue').mockImplementation();

  // Trigger the processing of the queue
  await deferredDbProcessor['processQueue']();

  // Assert that the queue is empty after processing
  const queue = deferredDbProcessor['queue$'].getValue();
  expect(queue.size).toBe(0);

  // Assert that the processQueue method was called
  expect(deferredDbProcessor['processQueue']).toHaveBeenCalled();
});
