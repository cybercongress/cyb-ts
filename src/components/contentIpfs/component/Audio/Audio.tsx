import { IPFSContent } from 'src/utils/ipfs/ipfs';

function Audio({ content }: { content: IPFSContent }) {
  const { result, meta } = content;

  console.log(content);

  const audioBlob = new Blob([new Uint8Array(result)], { type: meta.mime });
  const audioUrl = URL.createObjectURL(audioBlob);

  return (
    <audio controls>
      <source src={audioUrl} type={meta.mime} />
      Your browser does not support the audio tag.
    </audio>
  );
}

export default Audio;
