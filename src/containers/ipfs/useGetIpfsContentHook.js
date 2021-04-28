import { useState, useEffect } from 'react';
import { PATTERN_HTTP, PATTERN_IPFS_HASH } from '../../utils/config';
import db from '../../db';

const isSvg = require('is-svg');

const FileType = require('file-type');
const all = require('it-all');
const uint8ArrayConcat = require('uint8arrays/concat');
const uint8ArrayToAsciiString = require('uint8arrays/to-string');

export const getTypeContent = async (dataCid, cid) => {
  const response = {
    text: '',
    type: '',
    content: '',
    link: `/ipfs/${cid}`,
    gateway: null,
  };
  // console.log('dataCid', dataCid);
  // const bufs = [];
  // bufs.push(dataCid);
  // console.log(`bufs`, bufs)
  // const data = Buffer.concat(bufs);
  // console.log(`data`, data);
  // console.log('data', data);
  const data = dataCid;
  const dataFileType = await FileType.fromBuffer(data);
  if (dataFileType !== undefined) {
    const { mime } = dataFileType;
    const dataBase64 = data.toString('base64');
    // const dataBase64 = uint8ArrayToAsciiString(data, 'base64');

    if (mime.indexOf('image') !== -1) {
      response.text = false;
      const imgBase64 = uint8ArrayToAsciiString(data, 'base64');
      const file = `data:${mime};base64,${imgBase64}`;
      response.type = 'image';
      response.content = file;
      response.gateway = false;
      // response.status = 'downloaded';
    } else if (mime.indexOf('application/pdf') !== -1) {
      response.text = false;
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
      response.text = false;
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
        response.content = `https://io.cybernode.ai/ipfs/${dataBase64}`;
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

const useGetIpfsContent = (cid, nodeIpfs, size = 1.5) => {
  const [content, setContent] = useState('');
  const [text, setText] = useState(cid);
  const [typeContent, setTypeContent] = useState('');
  const [status, setStatus] = useState('understandingState');
  const [link, setLink] = useState(`/ipfs/${cid}`);
  const [gateway, setGateway] = useState(null);
  const [loading, setLoading] = useState(true);
  const [metaData, setMetaData] = useState({
    type: 'file',
    size: 0,
    blockSizes: [],
    data: '',
  });

  useEffect(() => {
    const feachData = async () => {
      setLoading(true);
      const dataIndexdDb = await db.table('cid').get({ cid });
      if (dataIndexdDb !== undefined && dataIndexdDb.content) {
        const contentCidDB = Buffer.from(dataIndexdDb.content);
        const dataTypeContent = await getTypeContent(contentCidDB, cid);
        const {
          text: textContent,
          type,
          content: contentCid,
          link: linkContent,
        } = dataTypeContent;
        if (dataIndexdDb.meta) {
          setMetaData(dataIndexdDb.meta);
        } else {
          setMetaData((item) => ({
            ...item,
            data: dataIndexdDb.content,
          }));
        }
        setText(textContent);
        setTypeContent(type);
        setContent(contentCid);
        setLink(linkContent);
        setGateway(dataTypeContent.gateway);
        setStatus('downloaded');
        setLoading(false);
      } else if (nodeIpfs !== null) {
        const responseDag = await nodeIpfs.dag.get(cid, {
          localResolve: false,
        });
        const meta = {
          type: 'file',
          size: 0,
          blockSizes: [],
          data: '',
        };
        const linksCid = [];
        if (responseDag.value.Links && responseDag.value.Links.length > 0) {
          responseDag.value.Links.forEach((item, index) => {
            if (item.Name.length > 0) {
              linksCid.push({ name: item.Name, size: item.Tsize });
            } else {
              linksCid.push(item.Tsize);
            }
          });
        }
        meta.size = responseDag.value.size;
        meta.blockSizes = linksCid;
        if (responseDag.value.size < size * 10 ** 6) {
          nodeIpfs.pin.add(cid);
          const responseCat = uint8ArrayConcat(await all(nodeIpfs.cat(cid)));
          const someVar = responseCat;
          // const responseCat = await nodeIpfs.cat(cid);
          // console.log('responseCat', someVar);
          meta.data = someVar;
          const ipfsContentAddtToInddexdDB = {
            cid,
            content: someVar,
            meta,
          };
          // await db.table('test').add(ipfsContentAddtToInddexdDB);
          db.table('cid')
            .add(ipfsContentAddtToInddexdDB)
            .then((id) => {
              console.log('item :>> ', id);
            });
          const dataTypeContent = await getTypeContent(someVar, cid);
          const {
            text: textContent,
            type,
            content: contentCid,
            linkContent,
          } = dataTypeContent;
          setText(textContent);
          setTypeContent(type);
          setContent(contentCid);
          setLink(linkContent);
          setStatus('downloaded');
          setGateway(dataTypeContent.gateway);
        } else {
          setContent(cid);
          setGateway(true);
          setStatus('availableDownload');
          setText(cid);
        }
        setLoading(false);
      } else {
        setLoading(false);
        setContent(cid);
        setText(cid);
        setGateway(true);
        setStatus('impossibleLoad');
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
  };
};

export default useGetIpfsContent;
