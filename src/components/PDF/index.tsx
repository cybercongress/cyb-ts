import Iframe from '../Iframe/Iframe';

function Pdf({ content, search }) {
  return (
    <Iframe
      height={search ? '400px' : '700px'}
      url={content}
      // TODO: USE loaded content
      // url={`${CYBER.CYBER_GATEWAY}${ipfsDataDetails?.link}`}
    />
  );
}

export default Pdf;
