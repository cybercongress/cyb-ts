import { toString as uint8ArrayToAsciiString } from 'uint8arrays/to-string';
import isSvg from 'is-svg';
import { IPFSPath } from 'kubo-rpc-client/types';
import {
  IPFSContentDetails,
  IpfsContentSource,
  IpfsContentType,
  IpfsRawDataResponse,
} from './ipfs';
import { CYBER, PATTERN_HTTP, PATTERN_IPFS_HASH } from '../config';

import { getResponseResult } from './stream-utils';

function createObjectURL(rawData: Uint8Array, type: string) {
  const blob = new Blob([rawData], { type });
  return URL.createObjectURL(blob);
}

function createImgData(rawData: Uint8Array, type: string) {
  const imgBase64 = uint8ArrayToAsciiString(rawData, 'base64');
  const file = `data:${type};base64,${imgBase64}`;
  return file;
}

// eslint-disable-next-line import/no-unused-modules
export const detectContentType = (
  mime: string | undefined
): IpfsContentType => {
  if (mime && mime.indexOf('video') !== -1) {
    return 'video';
  }

  return 'other';
};

// eslint-disable-next-line import/no-unused-modules
export const chunksToBlob = (
  chunks: Array<Uint8Array>,
  mime: string | undefined
) => new Blob(chunks, mime ? { type: mime } : {});

// eslint-disable-next-line import/no-unused-modules, import/prefer-default-export
export const parseRawIpfsData = async (
  rawDataResponse: IpfsRawDataResponse,
  mime: string | undefined,
  cid: IPFSPath
): Promise<IPFSContentDetails> => {
  try {
    const response: IPFSContentDetails = {
      link: `/ipfs/${cid}`,
      gateway: false,
    };

    if (detectContentType(mime) === 'video') {
      // This type of content uses AsyncIterator<Uint8Array>
      response.type = 'video';
      // response.content = await getResponseResult(rawDataResponse);
      return response;
    }

    const rawData = await getResponseResult(rawDataResponse);

    if (!mime) {
      response.text = `Can't detect MIME for ${cid.toString()}`;
      response.gateway = true; // ???
    } else if (
      mime.indexOf('text/plain') !== -1 ||
      mime.indexOf('application/xml') !== -1
    ) {
      if (isSvg(Buffer.from(rawData))) {
        response.type = 'image';
        response.content = createImgData(rawData, 'image/svg+xml'); // file
      } else {
        const dataBase64 = uint8ArrayToAsciiString(rawData);
        // TODO: search can bel longer for 42???!
        // also cover ipns links
        response.link =
          dataBase64.length > 42 ? `/ipfs/${cid}` : `/search/${dataBase64}`;

        if (dataBase64.match(PATTERN_IPFS_HASH)) {
          response.gateway = true;
          response.type = 'link';
          response.content = `${CYBER.CYBER_GATEWAY}ipfs/${dataBase64}`;
        } else if (dataBase64.match(PATTERN_HTTP)) {
          response.type = 'link';
          response.gateway = false;
          response.content = dataBase64;
          response.link = `/ipfs/${cid}`;
        } else {
          response.type = 'text';
          response.content = dataBase64;
          response.text =
            dataBase64.length > 300
              ? `${dataBase64.slice(0, 300)}...`
              : dataBase64;
        }
      }
    } else if (mime.indexOf('image') !== -1) {
      response.content = createImgData(rawData, mime); // file
      response.type = 'image';
      response.gateway = false;
    } else if (mime.indexOf('application/pdf') !== -1) {
      response.type = 'pdf';
      response.content = createObjectURL(rawData, mime); // file
      response.gateway = true; // ???
    }

    return response;
  } catch (e) {
    console.log('----parseRawIpfsData', e, cid, mime);
    return undefined;
  }
};
