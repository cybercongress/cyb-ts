import { useState, useEffect } from 'react';
import { toString as uint8ArrayToAsciiString } from 'uint8arrays/to-string';
import isSvg from 'is-svg';
import FileType from 'file-type';
import { IPFS } from 'kubo-rpc-client/types';
import { CYBER, PATTERN_HTTP, PATTERN_IPFS_HASH } from '../../utils/config';
import { getIPFSContent } from '../../utils/ipfs/utils-ipfs';
import { IPFSData, IPFSContentMeta } from '../../utils/ipfs/ipfs.d';

type TextMaybe = string | undefined;

type TypeContent = {
  text: TextMaybe;
  type: 'image' | 'application/pdf' | 'link' | 'text' | undefined;
  content: string;
  link: string;
  gateway: boolean;
};

export const getTypeContent = async (
  data: IPFSData,
  cid: string
): Promise<TypeContent> => {
  const response: TypeContent = {
    text: '',
    type: undefined,
    content: '',
    link: `/ipfs/${cid}`,
    gateway: false,
  };
  const dataFileType = await FileType.fromBuffer(data);
  // console.log(`dataFileType`, dataFileType)
  if (dataFileType !== undefined) {
    const { mime } = dataFileType;
    const dataBase64 = data.toString('base64');
    // const dataBase64 = uint8ArrayToAsciiString(data, 'base64');

    if (mime.indexOf('image') !== -1) {
      const imgBase64 = uint8ArrayToAsciiString(data, 'base64');
      const file = `data:${mime};base64,${imgBase64}`;
      response.type = 'image';
      response.content = file;
      response.gateway = false;
      // response.status = 'downloaded';
    } else if (mime.indexOf('application/pdf') !== -1) {
      const file = `data:${mime};base64,${dataBase64}`;
      response.type = 'application/pdf';
      response.content = file;
      response.gateway = true;
    } else {
      response.text = cid;
      response.gateway = true;
    }
  } else {
    const dataBase64 = uint8ArrayToAsciiString(data);
    response.content = dataBase64;
    if (isSvg(data)) {
      const file = `data:image/svg+xml;base64,${uint8ArrayToAsciiString(
        data,
        'base64'
      )}`;
      response.type = 'image';
      response.content = file;
      response.gateway = false;
    } else {
      if (dataBase64.length > 42) {
        response.link = `/ipfs/${cid}`;
      } else {
        response.link = `/search/${dataBase64}`;
      }
      if (dataBase64.length > 300) {
        response.text = `${dataBase64.slice(0, 300)}...`;
      } else {
        response.text = dataBase64;
      }
      if (dataBase64.match(PATTERN_IPFS_HASH)) {
        response.gateway = true;
        response.type = 'link';
        response.content = `${CYBER.CYBER_GATEWAY}ipfs/${dataBase64}`;
      } else {
        response.type = 'text';
      }
      if (dataBase64.match(PATTERN_HTTP)) {
        response.type = 'link';
        response.gateway = false;
        response.content = dataBase64;
        response.link = `/ipfs/${cid}`;
      } else {
        response.type = 'text';
      }
    }
  }
  return response;
};

const useGetIpfsContent = (cid: string, nodeIpfs: IPFS) => {
  const [content, setContent] = useState('');
  const [text, setText] = useState(cid);
  const [typeContent, setTypeContent] = useState<string | undefined>('');
  const [status, setStatus] = useState('understandingState');
  const [link, setLink] = useState(`/ipfs/${cid}`);
  const [gateway, setGateway] = useState(false);
  const [statusFetching, setStatusFetching] = useState('');
  const [loading, setLoading] = useState(true);

  const [metaData, setMetaData] = useState<IPFSContentMeta>({
    type: 'file',
    size: 0,
    blockSizes: [],
    data: '',
  });

  useEffect(() => {
    const feachData = async (): Promise<void> => {
      setLoading(true);
      setStatusFetching('');

      const dataResponseByCid = await getIPFSContent(
        nodeIpfs,
        cid,
        undefined,
        setStatusFetching
      );

      if (!dataResponseByCid) {
        setStatus('impossibleLoad');
        setLoading(false);
      } else if (dataResponseByCid === 'availableDownload') {
        setContent(cid);
        setGateway(true);
        setStatus('availableDownload');
        setText(cid);
      } else {
        const { data, meta } = dataResponseByCid;
        const dataTypeContent = await getTypeContent(data as IPFSData, cid);
        setTypeContent(dataTypeContent.type);
        setContent(dataTypeContent.content);
        setLink(dataTypeContent.link);
        setGateway(dataTypeContent.gateway);
        setStatus('downloaded');
        setMetaData(meta);
        setLoading(false);
      }
    };
    feachData();
  }, [cid, nodeIpfs]);

  return {
    content,
    text,
    typeContent,
    status,
    link,
    gateway,
    metaData,
    loading,
    statusFetching,
  };
};

export default useGetIpfsContent;
