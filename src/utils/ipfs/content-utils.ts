import { toString as uint8ArrayToAsciiString } from 'uint8arrays/to-string';
import isSvg from 'is-svg';
import { IPFSContent, IPFSContentDetails, IpfsContentType } from './ipfs';
import { PATTERN_PARTICLE, PATTERN_HTTP, PATTERN_IPFS_HASH } from '../config';

import { getResponseResult, onProgressCallback } from './stream-utils';

function createObjectURL(rawData: Uint8Array, type: string) {
  const blob = new Blob([rawData], { type });
  return URL.createObjectURL(blob);
}

export function createImgData(rawData: Uint8Array, type: string) {
  const imgBase64 = uint8ArrayToAsciiString(rawData, 'base64');
  return `data:${type};base64,${imgBase64}`;
}

const basic = /\s?<!doctype html>|(<html\b[^>]*>|<body\b[^>]*>|<x-[^>]+>)+/i;

function isHtml(string: string) {
  const newString = string.trim().slice(0, 1000);
  return basic.test(newString);
}

// eslint-disable-next-line import/no-unused-modules
export const detectContentType = (
  mime: string | undefined
): IpfsContentType => {
  if (mime) {
    if (mime.indexOf('video') !== -1) {
      return 'video';
    }
    if (mime.indexOf('text/plain') !== -1) {
      return 'text';
    }
    if (mime.indexOf('xml') !== -1) {
      return 'xml';
    }
    if (mime.indexOf('image') !== -1) {
      return 'image';
    }
    if (mime.indexOf('pdf') !== -1) {
      return 'pdf';
    }
  }
  return 'other';
};

const detectTextContentType = (dataBase64?: string): IpfsContentType => {
  if (!dataBase64) {
    return 'other';
  }
  if (dataBase64.match(PATTERN_PARTICLE)) {
    return 'particle';
  }
  if (dataBase64.match(PATTERN_IPFS_HASH)) {
    return 'cid';
  }
  if (dataBase64.match(PATTERN_HTTP)) {
    return 'link';
  }
  if (isHtml(dataBase64)) {
    return 'html';
  }

  return 'text';
};

export const detectCybContentType = (
  mime: string | undefined,
  data?: Uint8Array
): IpfsContentType => {
  const contentType = detectContentType(mime);
  if (contentType === 'text' && data) {
    return detectTextContentType(uint8ArrayToAsciiString(data));
  }
  return contentType;
};

// eslint-disable-next-line import/no-unused-modules
export const chunksToBlob = (
  chunks: Array<Uint8Array>,
  mime: string | undefined
) => new Blob(chunks, mime ? { type: mime } : {});

// eslint-disable-next-line import/no-unused-modules, import/prefer-default-export
export const parseRawIpfsData = async (
  cid: string,
  content: IPFSContent,
  onProgress?: onProgressCallback
): Promise<IPFSContentDetails> => {
  try {
    const { contentType, result, meta } = content;
    const response: IPFSContentDetails = {
      link: `/ipfs/${cid}`,
      gateway: false,
      cid,
    };

    if (!meta.mime) {
      response.text = `Can't detect MIME for ${cid.toString()}`;
      response.gateway = true;
      return response;
    }

    response.type = contentType;

    // if (contentType === 'directory') {
    //   console.log('-parse', cid, contentType, response);

    //   response.gateway = true;
    //   return response;
    // }

    if (contentType === 'video') {
      // This type of content uses AsyncIterator<Uint8Array>
      // response.content = await getResponseResult(rawDataResponse);
      return response;
    }

    const rawData = result
      ? await getResponseResult(result, onProgress)
      : undefined;

    if (contentType === 'image') {
      response.content = createImgData(rawData, meta.mime);
      response.gateway = false;
      return response;
    }

    if (contentType === 'pdf') {
      response.content = createObjectURL(rawData, meta.mime);
      response.gateway = true;
      return response;
    }

    if (contentType === 'xml') {
      if (isSvg(Buffer.from(rawData))) {
        response.content = createImgData(rawData, 'image/svg+xml');
        return response;
      }
      response.content = uint8ArrayToAsciiString(rawData);
      return response;
    }

    if (contentType === 'text') {
      const dataBase64 = uint8ArrayToAsciiString(rawData);
      const textContentType = detectTextContentType(dataBase64);
      response.type = textContentType;

      response.link =
        dataBase64.length > 42 ? `/ipfs/${cid}` : `/search/${dataBase64}`;

      if (textContentType === 'particle') {
        response.content = dataBase64;
        response.gateway = true;
        return response;
      }
      if (textContentType === 'cid') {
        response.gateway = true;
        response.content = dataBase64;
        return response;
      }
      if (textContentType === 'link') {
        response.content = dataBase64;
        return response;
      }
      if (textContentType === 'html') {
        response.gateway = true;
        response.content = cid;
        return response;
      }

      response.content = dataBase64;
      response.text =
        dataBase64.length > 300 ? `${dataBase64.slice(0, 300)}...` : dataBase64;
      return response;
    }

    return response;
  } catch (e) {
    console.error('parseRawIpfsData error:', e, cid, content);
    return undefined;
  }
};
