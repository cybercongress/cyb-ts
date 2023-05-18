// TODO: move ipfs calls to ipfs-utils
import { getIPFSContent } from 'src/utils/ipfs/utils-ipfs';
import { getResponseResult } from 'src/utils/ipfs/stream-utils';
import { toString as uint8ArrayToAsciiString } from 'uint8arrays/to-string';

import { detectContentType } from 'src/utils/ipfs/content-utils';
import { PATTERN_CYBER } from '../../utils/config';

// TODO: IPFS move to utils
const getIndexdDb = async (cid, nodeIpfs) => {
  let addressResolve = null;
  if (nodeIpfs !== null) {
    const response = await getIPFSContent(nodeIpfs, cid);
    if (response?.result) {
      if (detectContentType(response.meta.mime) === 'text') {
        const rawData = await getResponseResult(response.result);

        const content = uint8ArrayToAsciiString(rawData);
        if (content.match(PATTERN_CYBER)) {
          addressResolve = content;
        }
      }
    }
  } else {
    return addressResolve;
  }
  return addressResolve;
};

export default getIndexdDb;
