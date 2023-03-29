import { Link } from 'react-router-dom';
import { Pane } from '@cybercongress/gravity';
import { CardStatisics } from '../../components';
import { formatNumber } from '../../utils/utils';
import AccountCount from '../brain/accountCount';
import useGetStatisticsCyber from './useGetStatisticsCyber';
import ForceGraph from '../forceGraph/forceGraph';

function Oracle() {
  const { knowledge } = useGetStatisticsCyber();

  const { linksCount, cidsCount } = knowledge;
  return (
    <>
      <main
        style={{
          position: 'absolute',
          left: '50%',
          zIndex: 2,
          backgroundColor: 'transparent',
          transform: 'translate(-50%, 0%)',
          marginRight: '-50%',
        }}
        className="block-body"
      >
        <Pane
          marginTop={10}
          marginBottom={50}
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(210px, 1fr))"
          gridGap="20px"
        >
          <Link to="/graph">
            <CardStatisics
              title="Cyberlinks"
              value={formatNumber(linksCount)}
              styleContainer={{ minWidth: 'unset' }}
            />
          </Link>
          <Link to="/particles">
            <CardStatisics
              title="Particles"
              value={formatNumber(cidsCount)}
              styleContainer={{ minWidth: 'unset' }}
            />
          </Link>
          <Link to="/search/neurons">
            <CardStatisics value={<AccountCount />} title="Neurons" />
          </Link>
        </Pane>
      </main>
      <ForceGraph />
    </>
  );
}

export default Oracle;
