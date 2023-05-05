import Iframe from '../Iframe/Iframe';

function Pdf({ content }) {
  return (
    <Iframe
      height="400px"
      url={content}
      // TODO: USE loaded content
      // url={`${CYBER.CYBER_GATEWAY}${ipfsDataDetails?.link}`}
    />
  );
}

export default Pdf;
