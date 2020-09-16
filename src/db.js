import Dexie from 'dexie';

const db = new Dexie('Test1');
db.version(3).stores({
  test: 'cid',
  following: 'cid',
});

export default db;
