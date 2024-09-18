import CyberlinksGraphContainer from 'src/features/cyberlinks/CyberlinksGraph/CyberlinksGraphContainer';
import { ParamsBlock } from 'src/pages/Brain/Brain';
import useGraphLimit from '../useGraphLimit';

function GraphView({ address }: { address?: string }) {
  const { limit, setSearchParams } = useGraphLimit(500);

  return (
    <div>
      <ParamsBlock limit={limit} setSearchParams={setSearchParams} />
      <CyberlinksGraphContainer
        address={address}
        limit={limit}
        toPortal
        type="3d"
      />
    </div>
  );
}

export default GraphView;
