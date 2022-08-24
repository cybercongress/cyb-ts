import Dexie from 'dexie';

const dbIbcHistory = new Dexie('ibc-histories');
dbIbcHistory.version(1).stores({
  histories: 'data',
});

export default dbIbcHistory;
