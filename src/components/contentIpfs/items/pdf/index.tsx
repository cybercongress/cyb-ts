import Iframe from 'src/components/Iframe/Iframe';

function Pdf({ content, search }: { content: string; search?: boolean }) {
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
