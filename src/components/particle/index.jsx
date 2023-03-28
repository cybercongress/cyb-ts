import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useGetCreator } from './hooks';
import { Titile } from './components';

function Particle({ cid, node }) {
  const { creator } = useGetCreator(cid);
  // const [content, setContent] = useState('');
  // const [textPreview, setTextPreview] = useState(cid);
  // const [typeContent, setTypeContent] = useState('');
  const [status, setStatus] = useState('understandingState');
  // const [link, setLink] = useState(`/ipfs/${cid}`);

  // useEffect(() => {
  //   const feachData = async () => {
  //     let responseData = null;

  //     const dataResponseByCid = await getContentByCid(node, cid);

  //     if (dataResponseByCid !== undefined) {
  //       if (dataResponseByCid === 'availableDownload') {
  //         setStatus('availableDownload');
  //         setTextPreview(cid);
  //       } else {
  //         responseData = dataResponseByCid;
  //       }
  //     } else {
  //       setStatus('impossibleLoad');
  //     }

  //     if (responseData !== null) {
  //       const { data } = responseData;
  //       const dataTypeContent = await getTypeContent(data, cid);

  //       const {
  //         text: textContent,
  //         type,
  //         content: contentCid,
  //         link: linkContent,
  //       } = dataTypeContent;

  //       setTextPreview(textContent);
  //       setTypeContent(type);
  //       setContent(contentCid);
  //       setLink(linkContent);
  //       setStatus('downloaded');
  //     }
  //   };
  //   feachData();
  // }, [cid, node]);

  return (
    <div>
      <Titile cid={cid} creator={creator} status={status} />
      {/* {status === 'downloaded' && (
        // <Link to={link}>
          <Content
            cid={cid}
            typeContent={typeContent}
            textPreview={textPreview}
            content={content}
          />
        // </Link>
      )} */}
    </div>
  );
}

const mapStateToProps = (store) => {
  return {
    node: store.ipfs.ipfs,
  };
};

export default connect(mapStateToProps)(Particle);
