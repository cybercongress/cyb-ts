import SenseRoutingWrapper from 'src/features/sense/ui/SenseRoutingWrapper';
import { useRobotContext } from './robot.context';
import Taverna from 'src/containers/taverna';
import { useAppSelector } from 'src/redux/hooks';

function SensePage() {
  const { isOwner } = useRobotContext();

  const keys = useAppSelector(
    (store) => store.pocket.defaultAccount.account?.cyber.keys
  );

  if (!isOwner && !(keys === 'read-only')) {
    return <Taverna />;
  }

  return <SenseRoutingWrapper />;
}

export default SensePage;
