import db from 'src/db';

export const addIpfsContentToDb = async (
  cid: string,
  blob: Blob
): Promise<void> => {
  const dbValue = await db.table('cid').get({ cid });

  if (!dbValue) {
    db.table('cid').add(blob);
  }
};

export const getIpfsContentFromDb = async (
  cid: string
): Promise<Uint8Array | undefined> => {
  // TODO: use cursor
  const dbValue = await db.table('cid').get({ cid });

  // backward compatibility
  return dbValue?.data || dbValue?.content;
};
