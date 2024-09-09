import useCyberlinks from 'src/features/cyberlinks/CyberlinksGraph/useCyberlinks';
import CyberlinksGraphContainerVR from 'src/features/cyberlinks/CyberlinksGraph/CyberlinksGraphContainerVR';
import { LIMIT_GRAPH } from '../utils';

function GraphView({ address }: { address?: string }) {
  const { data: fetchData, loading } = useCyberlinks(
    { address },
    {
      limit: LIMIT_GRAPH,
    }
  );

  return <CyberlinksGraphContainerVR data={fetchData} toPortal />;
}

export default GraphView;
