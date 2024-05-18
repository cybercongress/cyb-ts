import { DB_VERSION, type CybCozoDb } from '../cozoDb';

const migrate = async (db: CybCozoDb) => {
  const version = await db.getDbVersion();
  console.log('Current db version:', version, typeof version);
  if (version < 1.1) {
    //
    console.log('⚡️ Migrating to 1.1');
    console.log('    add job_type field to sync_queue');
    await db.runCommand(`
        ?[id,status,priority, job_type, data] := *sync_queue{id,status,priority}, job_type=0, data=null;
        :replace sync_queue {
            id: String,
            job_type: Int =>
            data: Json?,
            status: Int default 0,
            priority: Float default 0,
        }
    `);

    console.log('    create embeddings relation');
    await db.runCommand(`
        :create embeddings {
            cid: String =>
            vec: <F32; 384>
        }
    `);

    console.log('    create embeddings:semantic index');
    await db.runCommand(`
        ::hnsw create embeddings:semantic{
            fields: [vec],
            dim: 384,
            ef: 100,
            m: 16
        }
    `);
  }

  await db.setDbVersion(DB_VERSION);
};

export default migrate;
