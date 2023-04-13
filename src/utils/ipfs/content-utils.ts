import { toString as uint8ArrayToAsciiString } from 'uint8arrays/to-string';
import isSvg from 'is-svg';
import { IPFSPath } from 'kubo-rpc-client/types';
import { IPFSContentDetails } from './ipfs';
import { CYBER, PATTERN_HTTP, PATTERN_IPFS_HASH } from '../config';

// eslint-disable-next-line import/no-unused-modules, import/prefer-default-export
export const parseRawIpfsData = (
  rawData: Uint8Array,
  mime: string | undefined,
  cid: IPFSPath
): IPFSContentDetails => {
  const response: IPFSContentDetails = {
    link: `/ipfs/${cid}`,
    gateway: false,
  };

  if (!mime) {
    response.text = `Can't detect MIME for ${cid.toString()}`;
    response.gateway = true; // ???
  } else if (mime === 'text/plain') {
    if (isSvg(rawData as Buffer)) {
      response.type = 'image';
      response.content = `data:image/svg+xml;base64,${uint8ArrayToAsciiString(
        rawData,
        'base64'
      )}`;
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
        response.text =
          dataBase64.length > 300
            ? `${dataBase64.slice(0, 300)}...`
            : dataBase64;
      }
    }
  } else if (mime.indexOf('image') !== -1) {
    const imgBase64 = uint8ArrayToAsciiString(rawData, 'base64');
    const file = `data:${mime};base64,${imgBase64}`;
    response.type = 'image';
    response.content = file;
    response.gateway = false;
  } else if (mime.indexOf('application/pdf') !== -1) {
    const file = `data:${mime};base64,${uint8ArrayToAsciiString(rawData)}`;
    response.type = 'pdf';
    response.content = file;
    response.gateway = true; // ???
  }

  return response;
};
