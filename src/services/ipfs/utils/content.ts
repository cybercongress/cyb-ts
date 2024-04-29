import { toString as uint8ArrayToAsciiString } from 'uint8arrays/to-string';
import isSvg from 'is-svg';
import { PATTERN_HTTP, PATTERN_IPFS_HASH } from 'src/constants/patterns';
import {
  IPFSContentDetails,
  IPFSContentMaybe,
  IpfsContentType,
} from '../types';
import { getResponseResult, onProgressCallback } from './stream';

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
  if (mime) {
    if (mime.includes('video')) {
      return 'video';
    }

    if (mime.includes('audio')) {
      return 'audio';
    }
  }
  return 'other';
};

const basic = /\s?<!doctype html>|(<html\b[^>]*>|<body\b[^>]*>|<x-[^>]+>)+/i;

function isHtml(string) {
  const newString = string.trim().slice(0, 1000);
  return basic.test(newString);
}

function shortenString(string: string, length = 300) {
  return string.length > length ? `${string.slice(0, length)}...` : string;
}

// eslint-disable-next-line import/no-unused-modules
export const chunksToBlob = (
  chunks: Array<Uint8Array>,
  mime: string | undefined
) => new Blob(chunks, mime ? { type: mime } : {});

// eslint-disable-next-line import/no-unused-modules, import/prefer-default-export
export const parseArrayLikeToDetails = async (
  content: IPFSContentMaybe,
  // rawDataResponse: Uint8ArrayLike | undefined,
  // mime: string | undefined,
  cid: string,
  onProgress?: onProgressCallback
): Promise<IPFSContentDetails> => {
  try {
    // console.log('------parseArrayLikeToDetails', cid, content);
    const mime = content?.meta?.mime;
    const response: IPFSContentDetails = {
      link: `/ipfs/${cid}`,
      gateway: false,
      cid,
    };
    const initialType = detectContentType(mime);
    if (['video', 'audio'].indexOf(initialType) > -1) {
      return { ...response, type: initialType, gateway: true };
    }

    const rawData = content?.result
      ? await getResponseResult(content.result, onProgress)
      : undefined;

    // console.log(rawData);

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
          response.type = 'other';
          response.content = dataBase64;
          response.link = `/ipfs/${cid}`;
        } else if (dataBase64.match(PATTERN_HTTP)) {
          response.type = 'link';
          response.gateway = false;
          response.content = dataBase64;
          response.link = `/ipfs/${cid}`;
        } else if (isHtml(dataBase64)) {
          response.type = 'other';
          response.gateway = true;
          response.content = cid.toString();
        } else {
          response.type = 'text';
          response.content = dataBase64;
          response.text = shortenString(dataBase64);
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
    console.log('----parseRawIpfsData', e, cid);
    return undefined;
  }
};

export const contentToUint8Array = async (
  content: File | string
): Promise<Uint8Array> => {
  return new Uint8Array(
    typeof content === 'string'
      ? Buffer.from(content)
      : await content.arrayBuffer()
  );
};

export const createTextPreview = (
  array: Uint8Array | undefined,
  mime?: string,
  previewLength = 150
) => {
  return array && mime && mime === 'text/plain'
    ? uint8ArrayToAsciiString(array).slice(0, previewLength)
    : undefined;
};
