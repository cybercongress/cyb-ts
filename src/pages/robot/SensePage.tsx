import SenseRoutingWrapper from 'src/features/sense/ui/SenseRoutingWrapper';
import { useRobotContext } from './robot.context';
import Taverna from 'src/containers/taverna';

function SensePage() {
  const { isOwner } = useRobotContext();

  if (!isOwner) {
    return <Taverna />;
  }
  return <SenseRoutingWrapper />;
}

export default SensePage;
