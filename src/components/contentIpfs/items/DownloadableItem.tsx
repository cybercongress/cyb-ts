import { CYBER } from 'src/utils/config';
import GatewayContentItem from './gateway';

function DownloadableItem({ cid, search }: { cid: string; search?: boolean }) {
  if (search) {
    return <div>{`${cid} (gateway)`}</div>;
  }
  return <GatewayContentItem url={`${CYBER.CYBER_GATEWAY}/ipfs/${cid}`} />;
}

export default DownloadableItem;
