import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Pane } from '@cybercongress/gravity';
import { connect } from 'react-redux';
import ActionBar from './actionBar';
import { getProposals, getMinDeposit } from '../../utils/governance';
import Columns from './components/columns';
import { AcceptedCard, ActiveCard, RejectedCard } from './components/card';
import { Card, ContainerCard, CardStatisics } from '../../components';
import { CYBER, PROPOSAL_STATUS } from '../../utils/config';
import { formatNumber, coinDecimals } from '../../utils/utils';
import { getcommunityPool } from '../../utils/search/utils';
import { AppContext } from '../../context';

const dateFormat = require('dateformat');

const Statistics = ({ communityPoolCyber, staked }) => (
  <Pane
    marginTop={10}
    marginBottom={50}
    display="grid"
    gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
    gridGap="20px"
  >
    <CardStatisics
      title={`Community pool, ${CYBER.DENOM_CYBER.toUpperCase()}`}
      value={formatNumber(Math.floor(communityPoolCyber))}
    />
    <Link to="/halloffame">
      <CardStatisics
        title="% of staked BOOT"
        value={formatNumber(staked * 100)}
        link
      />
    </Link>
    <Link to="/network/bostrom/parameters">
      <CardStatisics title="Network parameters" value={30} link />
    </Link>
  </Pane>
);

function Governance({ defaultAccount }) {
  const { jsCyber } = useContext(AppContext);
  const [tableData, setTableData] = useState([]);
  const [minDeposit, setMinDeposit] = useState(0);
  const [communityPoolCyber, setCommunityPoolCyber] = useState(0);
  const [account, setAccount] = useState(null);
  const [staked, setStaked] = useState(0);

  useEffect(() => {
    feachMinDeposit();
  }, []);

  useEffect(() => {
    if (
      defaultAccount.account !== null &&
      defaultAccount.account.cyber &&
      defaultAccount.account.cyber.keys !== 'read-only'
    ) {
      setAccount(defaultAccount.account.cyber);
    } else {
      setAccount(null);
    }
  }, [defaultAccount.name]);

  useEffect(() => {
    const getStatistics = async () => {
      if (jsCyber !== null) {
        let communityPool = 0;
        const totalCyb = {};
        let stakedBoot = 0;

        const dataCommunityPool = await jsCyber.communityPool();
        const { pool } = dataCommunityPool;
        if (dataCommunityPool !== null) {
          communityPool = coinDecimals(Math.floor(parseFloat(pool[0].amount)));
        }
        setCommunityPoolCyber(communityPool);

        const datagetTotalSupply = await jsCyber.totalSupply();
        if (Object.keys(datagetTotalSupply).length > 0) {
          datagetTotalSupply.forEach((item) => {
            totalCyb[item.denom] = parseFloat(item.amount);
          });
        }
        if (totalCyb.boot && totalCyb.sboot) {
          const { boot, sboot } = totalCyb;
          stakedBoot = sboot / boot;
        }
        setStaked(stakedBoot);
      }
    };
    getStatistics();
  }, [jsCyber]);

  useEffect(() => {
    feachProposals();
  }, []);

  const feachProposals = async () => {
    // if (jsCyber !== null) {
    const responseProposals = await getProposals();
    // const responseProposals = await jsCyber.proposals(
    //   PROPOSAL_STATUS.PROPOSAL_STATUS_PASSED,
    //   '',
    //   ''
    // );
    if (responseProposals !== null) {
      setTableData(responseProposals);
    }
    // }
  };

  const feachMinDeposit = async () => {
    const responseMinDeposit = await getMinDeposit();

    if (responseMinDeposit !== null) {
      setMinDeposit(parseFloat(responseMinDeposit.min_deposit[0].amount));
    }
  };

  console.log('tableData', tableData);
  const active = tableData
    .reverse()
    .filter((item) => item.status < PROPOSAL_STATUS.PROPOSAL_STATUS_PASSED)
    .map((item) => (
      <Link key={item.id} style={{ color: 'unset' }} to={`/senate/${item.id}`}>
        <ActiveCard
          key={item.id}
          id={item.id}
          name={item.content.value.title}
          minDeposit={minDeposit}
          totalDeposit={item.total_deposit}
          type={item.content.type}
          state={item.status}
          timeEndDeposit={dateFormat(
            new Date(item.deposit_end_time),
            'dd/mm/yyyy, HH:MM:ss'
          )}
          timeEndVoting={dateFormat(
            new Date(item.voting_end_time),
            'dd/mm/yyyy, HH:MM:ss'
          )}
          amount={item.total_deposit[0]}
        />
      </Link>
    ));

  const accepted = tableData
    .filter((item) => item.status === PROPOSAL_STATUS.PROPOSAL_STATUS_PASSED)
    .map((item) => (
      <Link key={item.id} style={{ color: 'unset' }} to={`/senate/${item.id}`}>
        <AcceptedCard
          key={item.id}
          id={item.id}
          name={item.content.value.title}
          votes={item.final_tally_result}
          type={item.content.type}
          amount={item.total_deposit[0]}
          timeEnd={dateFormat(
            new Date(item.voting_end_time),
            'dd/mm/yyyy, HH:MM:ss'
          )}
        />
      </Link>
    ));

  const rejected = tableData
    .reverse()
    .filter((item) => item.status > PROPOSAL_STATUS.PROPOSAL_STATUS_PASSED)
    .map((item) => (
      <Link key={item.id} style={{ color: 'unset' }} to={`/senate/${item.id}`}>
        <RejectedCard
          key={item.id}
          id={item.id}
          name={item.content.value.title}
          votes={item.final_tally_result}
          type={item.content.type}
          amount={item.total_deposit[0]}
          timeEnd={dateFormat(
            new Date(item.voting_end_time),
            'dd/mm/yyyy, HH:MM:ss'
          )}
        />
      </Link>
    ));

  return (
    <div>
      <main className="block-body">
        <Statistics communityPoolCyber={communityPoolCyber} staked={staked} />
        <Pane
          display="grid"
          justifyItems="center"
          gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
          gridGap="20px"
        >
          <Columns title="Active">{active}</Columns>
          <Columns title="Accepted">{accepted}</Columns>
          <Columns title="Rejected">{rejected}</Columns>
        </Pane>
      </main>
      <ActionBar account={account} update={feachProposals} />
    </div>
  );
}

const mapStateToProps = (store) => {
  return {
    mobile: store.settings.mobile,
    defaultAccount: store.pocket.defaultAccount,
  };
};

export default connect(mapStateToProps)(Governance);
