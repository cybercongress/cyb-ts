import { CID } from 'multiformats/cid';
import { getIPFSContent } from 'src/utils/ipfs/utils-ipfs';
import { detectContentType } from 'src/utils/ipfs/content-utils';
import { responseToPlainData } from 'src/utils/ipfs/stream-utils';
import { toString as uint8ArrayToAsciiString } from 'uint8arrays/to-string';
import { AppIPFS, IpfsRawDataResponse } from 'src/utils/ipfs/ipfs';

export const isCID = (cid: string): boolean => {
  try {
    return CID.parse(cid).version === 0;
  } catch {
    return false;
  }
};

// eslint-disable-next-line import/prefer-default-export, import/no-unused-modules
export const getTextFromIpfsContent = async (response: IpfsRawDataResponse) => {
  if (typeof response === 'string') {
    return response;
  }
  const rawData = await responseToPlainData(response);
  const content = uint8ArrayToAsciiString(rawData);
  return content;
};

export const getIpfsTextContent = async (node?: AppIPFS, cid: string) => {
  const response = await getIPFSContent(node, cid);
  if (response?.result) {
    const contentType = detectContentType(response.meta.mime);

    if (contentType === 'text') {
      const content = await getTextFromIpfsContent(response.result);

      return {
        contentType,
        content,
      };
    }

    return { contentType, content: '' };
  }

  return { contentType: 'unknown', content: '' };
};
