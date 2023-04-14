// TODO: move ipfs calls to ipfs-utils
import all from 'it-all';
import { fileTypeFromBuffer } from 'file-type';
import { PATTERN_CYBER } from '../../utils/config';
import db from '../../db';

// TODO: IPFS move to utils
const getIndexdDb = async (cid, nodeIpfs) => {
  let addressResolve = null;
  const dataIndexdDb = await db.table('following').get({ cid });
  if (dataIndexdDb !== undefined) {
    addressResolve = dataIndexdDb.content;
  } else if (nodeIpfs !== null) {
    const responseDag = await nodeIpfs.dag.get(cid, {
      localResolve: false,
    });
    if (responseDag.value.size < 1.5 * 10 ** 6) {
      const responseCat = await all(nodeIpfs.cat(cid));
      const { 0: someVar } = responseCat;
      const bufs = [];
      bufs.push(someVar);
      const dataBufs = Buffer.concat(bufs);
      const dataFileType = await fileTypeFromBuffer(dataBufs);
      if (dataFileType === undefined) {
        const dataBase64 = dataBufs.toString();
        if (dataBase64.match(PATTERN_CYBER)) {
          addressResolve = dataBase64;
          const ipfsContentAddtToInddexdDB = {
            cid,
            content: addressResolve,
          };
          db.table('following')
            .add(ipfsContentAddtToInddexdDB)
            .then((id) => {
              console.log('item :>> ', id);
            });
        }
      }
    }
  } else {
    return addressResolve;
  }
  return addressResolve;
};

export default getIndexdDb;
