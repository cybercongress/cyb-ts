// TODO: move ipfs calls to ipfs-utils
import { getIPFSContent } from 'src/utils/ipfs/utils/utils-ipfs';
import { getResponseResult } from 'src/utils/ipfs/utils/stream-utils';
import { parseRawIpfsData } from 'src/utils/ipfs/utils/content-utils';
import { PATTERN_CYBER } from '../../utils/config';

// TODO: IPFS move to utils
const getIndexdDb = async (cid, nodeIpfs) => {
  let addressResolve = null;
  if (nodeIpfs !== null) {
    const response = await getIPFSContent(cid, nodeIpfs);
    if (response?.result) {
      const rawData = await getResponseResult(response.result);
      const details = parseRawIpfsData(rawData, response.meta.mime, cid);
      const { content } = details;
      if (content && content.match(PATTERN_CYBER)) {
        addressResolve = content;
      }
    }
  } else {
    return addressResolve;
  }
  return addressResolve;
};

export default getIndexdDb;
