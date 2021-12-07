import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { AppContext } from '../../context';
import { searchClient } from '../../utils/search/utils';
import { trimString } from '../../utils/utils';
import db from '../../db';
import ValueImg from '../valueImg';

const FileType = require('file-type');
const all = require('it-all');
const uint8ArrayConcat = require('uint8arrays/concat');
const uint8ArrayToAsciiString = require('uint8arrays/to-string');

const testDenom =
  'pool5D83035BE0E7AB904379161D3C52FB4C1C392265AC19CE39A864146198610628';

const getTypeContent = async (dataCid) => {
  let response = '';
  const dataFileType = await FileType.fromBuffer(dataCid);
  if (dataFileType === undefined) {
    const dataBase64 = uint8ArrayToAsciiString(dataCid);
    if (dataBase64.length < 40) {
      response = dataBase64;
    }
  }
  return response;
};

function useGetDenom(denomValue, nodeIpfs) {
  const { jsCyber } = useContext(AppContext);
  const [denom, setDenom] = useState(denomValue);
  const [cid, setCid] = useState(null);
  const [type, setType] = useState('');

  useEffect(() => {
    setType('');
    if (denomValue.includes('ibc')) {
      setType('ibc');
    } else if (denomValue.includes('pool')) {
      setType('pool');
    } else {
      setType('');
    }
  }, [denomValue]);

  useEffect(() => {
    const search = async () => {
      setDenom(denomValue);
      if (
        (jsCyber !== null && denomValue.includes('pool')) ||
        denomValue.includes('ibc')
      ) {
        const response = await searchClient(jsCyber, denomValue, 0);
        console.log(`response`, response);
        if (response.result) {
          setCid(response.result[0].particle);
        } else {
          setDenom(denomValue);
        }
      } else {
        setDenom(denomValue);
        setCid(null);
      }
    };
    search();
  }, [jsCyber, denomValue]);

  useEffect(() => {
    const feachData = async () => {
      if (cid !== null) {
        const dataIndexdDb = await db.table('cid').get({ cid });
        if (dataIndexdDb !== undefined && dataIndexdDb.content) {
          const contentCidDB = Buffer.from(dataIndexdDb.content);
          const dataTypeContent = await getTypeContent(contentCidDB);
          if (dataTypeContent.length > 0) {
            setDenom(dataTypeContent);
          } else {
            setDenom(denomValue);
          }
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
          meta.size = responseDag.value.size;

          if (responseDag.value.size < 1.5 * 10 ** 6) {
            nodeIpfs.pin.add(cid);
            const responseCat = uint8ArrayConcat(await all(nodeIpfs.cat(cid)));
            meta.data = responseCat;
            const ipfsContentAddtToInddexdDB = {
              cid,
              content: responseCat,
              meta,
            };
            db.table('cid')
              .add(ipfsContentAddtToInddexdDB)
              .then((id) => {
                console.log('item :>> ', id);
              });
            const dataTypeContent = await getTypeContent(responseCat);
            if (dataTypeContent.length > 0) {
              setDenom(dataTypeContent);
            } else {
              setDenom(denomValue);
            }
          }
        }
      }
    };
    feachData();
  }, [nodeIpfs, cid, denomValue]);

  return { denom, type };
}

function Denom({ nodeIpfs, denomValue, ...props }) {
  try {
    const { denom, type } = useGetDenom(denomValue, nodeIpfs);

    return <ValueImg text={denom} type={type} {...props} />;
  } catch (error) {
    return <div>{denomValue}</div>;
  }
}

const mapStateToProps = (store) => {
  return {
    nodeIpfs: store.ipfs.ipfs,
    mobile: store.settings.mobile,
  };
};

export default connect(mapStateToProps)(Denom);
