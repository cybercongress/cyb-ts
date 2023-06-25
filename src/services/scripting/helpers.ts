import { getIPFSContent } from 'src/utils/ipfs/utils-ipfs';
import { detectContentType } from 'src/utils/ipfs/content-utils';
import { responseToPlainData } from 'src/utils/ipfs/stream-utils';
import { toString as uint8ArrayToAsciiString } from 'uint8arrays/to-string';
import { AppIPFS } from 'src/utils/ipfs/ipfs';

// eslint-disable-next-line import/prefer-default-export, import/no-unused-modules
export const getIpfsTextContent = async (node?: AppIPFS, cid: string) => {
  const response = await getIPFSContent(node, cid);
  if (response?.result) {
    if (detectContentType(response.meta.mime) === 'text') {
      const rawData = await responseToPlainData(response.result);
      const content = uint8ArrayToAsciiString(rawData);
      return content;
    }

    return null;
  }
  return undefined;
};
