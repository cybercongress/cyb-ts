import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Pane, Icon } from '@cybercongress/gravity';
import { CardStatisics } from '../../components';
import { formatNumber } from '../../utils/utils';
import Txs from '../brain/tx';
import AccountCount from '../brain/accountCount';
import useGetStatisticsCyber from './useGetStatisticsCyber';
import ForceGraph from '../forceGraph/forceGraph';

function Oracle({ block }) {
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
          <Link to="/network/bostrom/tx">
            <CardStatisics
              title="Transactions"
              value={<Txs />}
              styleContainer={{ minWidth: 'unset' }}
            />
          </Link>
          <Link to="/network/bostrom/block">
            <CardStatisics
              title="Blocks"
              value={formatNumber(parseFloat(block))}
              styleContainer={{ minWidth: 'unset' }}
            />
          </Link>
        </Pane>
      </main>
      <ForceGraph />
    </>
  );
}

const mapStateToProps = (store) => {
  return {
    block: store.block.block,
  };
};

export default connect(mapStateToProps)(Oracle);
