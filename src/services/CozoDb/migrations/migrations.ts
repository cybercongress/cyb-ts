import { DB_VERSION, type CybCozoDb } from '../cozoDb';

const migrate = async (db: CybCozoDb) => {
  const version = await db.getDbVersion();
  console.log('* db version:', version);
  if (version < 1.2) {
    //
    console.log('⚡️ Migrating to 1.1');
    console.log('    add job_type field to sync_queue');
    await db.runCommand(`
        ?[id,status,priority, job_type, data] := *sync_queue{id,status,priority}, job_type=0, data='';
        :replace sync_queue {
            id: String,
            job_type: Int =>
            data: String default '',
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

    console.log('    fill queue to calculate embeddings for all particles');
    await db.runCommand(`
        ?[id, data, job_type, status, priority] := *particle{cid, text, mime}, mime="text/plain", job_type=1, status=0, priority=0.5, id = cid, data=text

        :put sync_queue {
            id,
            job_type =>
            data,
            status,
            priority,
        }
    `);
  }

  await db.setDbVersion(DB_VERSION);
};

export default migrate;
