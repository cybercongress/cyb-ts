import { getIPFSContent } from 'src/utils/ipfs/utils-ipfs';
import { detectContentType } from 'src/utils/ipfs/content-utils';
import { responseToPlainData } from 'src/utils/ipfs/stream-utils';
import { toString as uint8ArrayToAsciiString } from 'uint8arrays/to-string';
import { AppIPFS, IPFSContent, IpfsRawDataResponse } from 'src/utils/ipfs/ipfs';

// eslint-disable-next-line import/prefer-default-export, import/no-unused-modules
export const getTextFromIpfsContent = async (response: IpfsRawDataResponse) => {
  const rawData = await responseToPlainData(response);
  const content = uint8ArrayToAsciiString(rawData);
  return content;
};

export const getIpfsTextContent = async (node?: AppIPFS, cid: string) => {
  const response = await getIPFSContent(node, cid);
  if (response?.result) {
    if (detectContentType(response.meta.mime) === 'text') {
      return getTextFromIpfsContent(response.result);
    }
  }
  return undefined;
};
