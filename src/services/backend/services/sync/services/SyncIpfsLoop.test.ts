import { of } from 'rxjs';
import SyncIpfsLoop from 'src/services/backend/services/sync/services/SyncIpfsLoop';
import DbApi from 'src/services/backend/services/dataSource/indexedDb/dbApiWrapper';
import { CybIpfsNode } from 'src/services/ipfs/ipfs';
import SyncQueue from 'src/services/backend/services/sync/services/SyncQueue';
import { fetchPins } from 'src/services/backend/services/dataSource/ipfs/ipfsSource';
import { mapPinToEntity } from 'src/services/CozoDb/mapping';
import BroadcastChannelSender from 'src/services/backend/channels/BroadcastChannelSender';
import { broadcastStatus } from 'src/services/backend/channels/broadcastStatus';

jest.mock('src/services/backend/services/dataSource/indexedDb/dbApiWrapper');
// jest.mock('src/services/ipfs/ipfs');
jest.mock('src/services/backend/services/sync/services/SyncQueue');
jest.mock('src/services/backend/services/dataSource/ipfs/ipfsSource');
jest.mock('src/services/CozoDb/mapping');

// import { BroadcastChannel } from 'broadcast-channel';
// import { BroadcastChannel as MockBroadcastChannel } from 'mock-broadcast-channel';

// jest.mock('broadcast-channel', () => {
//   return {
//     BroadcastChannel: MockBroadcastChannel
//   };
// });

jest.mock('src/services/backend/channels/BroadcastChannelSender', () => {
  return {
    __esModule: true, // this property makes it work like an ES6 module
    default: jest.fn(), // this mocks the default export
    broadcastStatus: jest.fn().mockReturnValue({
      sendStatus: jest.fn(),
    }),
  };
});

const createMock = <T extends {}>(): jest.Mocked<T> => {
  const mock: any = {};
  return new Proxy(mock, {
    get: (target, prop) => target[prop] || (target[prop] = jest.fn()),
  });
};

describe('SyncIpfsLoop', () => {
  let dbApi: DbApi;
  let ipfsNode: CybIpfsNode;
  let syncQueue: SyncQueue;
  let syncIpfsLoop: SyncIpfsLoop;

  beforeEach(() => {
    // You can also reset the mock if needed

    dbApi = new DbApi();
    ipfsNode = createMock<CybIpfsNode>();
    syncQueue = new SyncQueue();

    const serviceDeps = {
      dbInstance$: of(dbApi),
      ipfsInstance$: of(ipfsNode),
    };

    syncIpfsLoop = new SyncIpfsLoop(serviceDeps, syncQueue);
  });

  it('should be initialized', () => {
    expect(syncIpfsLoop).toBeDefined();
  });

  it('should start sync loop', () => {
    const startSpy = jest.spyOn(syncIpfsLoop, 'start');
    syncIpfsLoop.start();
    expect(startSpy).toHaveBeenCalled();
    // Now you can assert that sendStatus was called, specify its return value, etc.
    expect(sendStatusMock).toHaveBeenCalled();
  });

  it('should sync pins', async () => {
    const pins = [
      { cid: { toString: () => 'cid1' } },
      { cid: { toString: () => 'cid2' } },
    ];
    (fetchPins as jest.Mock).mockResolvedValue(pins);
    (dbApi.getPins as jest.Mock).mockResolvedValue({ rows: [['cid1']] });
    (dbApi.getParticles as jest.Mock).mockResolvedValue({ rows: [['cid1']] });
    (mapPinToEntity as jest.Mock).mockImplementation((pin) => pin);

    await syncIpfsLoop['syncPins']();

    expect(fetchPins).toHaveBeenCalledWith(ipfsNode);
    expect(dbApi.getPins).toHaveBeenCalled();
    expect(dbApi.getParticles).toHaveBeenCalledWith(['cid']);
    expect(syncQueue.pushToSyncQueue).toHaveBeenCalledWith([
      { id: 'cid2', priority: 1 },
    ]);
    expect(dbApi.putPins).toHaveBeenCalledWith([
      { cid: { toString: () => 'cid2' } },
    ]);
  });
});
