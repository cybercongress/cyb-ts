import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import Iframe from 'react-iframe';
import { getContentByCid } from '../../utils/search/utils';
import { Loading } from '../../components';

const FileType = require('file-type');

function Ipfs({ node }) {
  const { cid } = useParams();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  console.log(cid);

  useEffect(() => {
    const feacData = async () => {
      setLoading(true);
      let mime;
      const buf = await node.cat(cid);
      const bufs = [];
      bufs.push(buf);
      const data = await Buffer.concat(bufs);
      const dataFileType = await FileType.fromBuffer(data);
      const dataBase64 = await data.toString('base64');
      console.warn(dataFileType);
      if (dataFileType !== undefined) {
        mime = dataFileType.mime;
      } else {
        mime = 'text/plain';
      }
      const fileType = `data:${mime};base64,${dataBase64}`;
      setContent(fileType);
      setLoading(false);
      console.warn('onClickCut1', data.toString('base64'));
    };
    feacData();
  }, [cid]);

  if (loading) {
    return (
      <div
        style={{
          width: '100%',
          height: '50vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Loading />
        <div style={{ color: '#fff', marginTop: 20, fontSize: 20 }}>
          get Content
        </div>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', height: '100%' }}>
      <Iframe
        width="100%"
        height="100%"
        className="iframe-SearchItem"
        url={content}
      />
    </div>
  );
}

const mapStateToProps = store => {
  return {
    node: store.ipfs.ipfs,
  };
};

export default connect(mapStateToProps)(Ipfs);
