import { CYBER } from 'src/utils/config';
import GatewayContentItem from './gateway';
import TextMarkdown from './TextMarkdown';

function OtherItem({
  content,
  cid,
  search,
}: {
  cid: string;
  search?: boolean;
  content?: string;
}) {
  if (search) {
    return (
      <TextMarkdown fullWidth={search}>
        {content || `${cid} (n/a)`}
      </TextMarkdown>
    );
  }
  return <GatewayContentItem url={`${CYBER.CYBER_GATEWAY}/ipfs/${cid}`} />;
}

export default OtherItem;
