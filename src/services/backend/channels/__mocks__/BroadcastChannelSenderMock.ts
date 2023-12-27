// __mocks__/BroadcastChannelSenderMock.ts

export const mockPostServiceStatus = jest.fn();
export const mockPostSyncStatus = jest.fn();
export const mockPostSyncEntryProgress = jest.fn();
export const mockPost = jest.fn();

const mock = jest.fn().mockImplementation(() => ({
  postServiceStatus: async (...args) => {
    console.log('---------mock BC postServiceStatus', args);
    return mockPostServiceStatus(args);
  },
  postSyncStatus: async (...args) => {
    console.log('---------mock BC postSyncStatus', args);
    return mockPostSyncStatus(args);
  },
  postSyncEntryProgress: async (...args) => {
    console.log('---------mock BC postSyncEntryProgress', args);
    return mockPostSyncEntryProgress(args);
  },
  post: async (...args) => {
    console.log('---------mock BC post', args);
    return mockPost(args);
  },
}));

export default mock;
