import { getIPFSContent } from 'src/utils/ipfs/utils-ipfs';
import { detectContentType } from 'src/utils/ipfs/content-utils';
import { responseToPlainData } from 'src/utils/ipfs/stream-utils';
import { toString as uint8ArrayToAsciiString } from 'uint8arrays/to-string';
import { AppIPFS, IPFSContent, IpfsRawDataResponse } from 'src/utils/ipfs/ipfs';
import { queueManager } from '../QueueManager/QueueManager';
import { isCID } from 'src/utils/ipfs/helpers';
import { Nullable } from 'src/types';

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
    if (detectContentType(response.meta.mime) === 'text') {
      return getTextFromIpfsContent(response.result);
    }
  }
  return undefined;
};

export async function getScriptFromParticle(cid?: Nullable<string>) {
  if (!cid || !isCID(cid)) {
    // throw new Error('cid is not valid');
    return undefined;
  }

  const queueResult = await queueManager.enqueueAndWait(cid);
  const result = queueResult?.result;
  if (!result?.result || result?.contentType !== 'text') {
    // throw new Error('content is not valid');
    return undefined;
  }

  return getTextFromIpfsContent(result.result);
}
