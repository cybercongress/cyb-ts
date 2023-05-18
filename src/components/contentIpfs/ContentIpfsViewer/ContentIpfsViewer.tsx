import { IPFSContentMaybe } from 'src/utils/ipfs/ipfs';
import ParticleItem from '../ParticleItem/ParticleItem';
import { ContentOptions } from '../contentIpfs.d';
import ContentIpfs from '../contentIpfs';

type ContentIpfsWrapperProps = {
  content: IPFSContentMaybe;
  status: string | undefined;
  cid?: string;
  search?: boolean;
  options?: ContentOptions;
};

function ContentIpfsViewer({
  status,
  content,
  cid,
  search,
  options,
}: ContentIpfsWrapperProps) {
  if (content?.contentType === 'particle' && content?.result) {
    return (
      <ParticleItem
        content={content.result}
        options={options}
        search={search}
      />
    );
  }

  return (
    <ContentIpfs content={content} status={status} cid={cid} search={search} />
  );
}
export default ContentIpfsViewer;
