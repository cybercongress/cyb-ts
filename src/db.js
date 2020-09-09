import Dexie from 'dexie';

const db = new Dexie('Test1');
db.version(2).stores({
  test: '++id, cid',
  following: '++id, cid',
});

export default db;
