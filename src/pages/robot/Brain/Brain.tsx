import { useEffect } from 'react';
import { useAdviser } from 'src/features/adviser/context';
import CyberlinksGraphContainer from 'src/features/cyberlinks/CyberlinksGraph/CyberlinksGraphContainer';
import { useRobotContext } from '../robot.context';

const limit = 1000;

function Brain() {
  const { address } = useRobotContext();
  const { setAdviser } = useAdviser();

  useEffect(() => {
    setAdviser(
      <>
        neurons public knowledge cybergraph <br />
        that is how last {limit} cyberlinks looks like
      </>
    );
  }, [setAdviser]);

  return <CyberlinksGraphContainer limit={limit} address={address} toPortal />;
}

export default Brain;
