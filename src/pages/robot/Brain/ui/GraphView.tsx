import useCyberlinks from 'src/features/cyberlinks/CyberlinksGraph/useCyberlinks';
import CyberlinksGraphContainer from 'src/features/cyberlinks/CyberlinksGraph/CyberlinksGraphContainer';
import { LIMIT_GRAPH } from '../utils';

function GraphView({ address }: { address?: string }) {
  const { data: fetchData, loading } = useCyberlinks(
    { address },
    {
      limit: LIMIT_GRAPH,
    }
  );

  return <CyberlinksGraphContainer data={fetchData} toPortal type="3d" />;
}

export default GraphView;
