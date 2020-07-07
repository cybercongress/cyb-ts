import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pane } from '@cybercongress/gravity';
import ActionBar from './actionBar';
import { getProposals, getMinDeposit } from '../../utils/governance';
import Columns from './components/columns';
import { AcceptedCard, ActiveCard, RejectedCard } from './components/card';

const dateFormat = require('dateformat');

function Governance() {
  const [tableData, setTableData] = useState([]);
  const [minDeposit, setMinDeposit] = useState(0);

  useEffect(() => {
    const feachgetMinDeposit = async () => {
      const response = await getMinDeposit();
      if (response !== null) {
        setMinDeposit(parseFloat(response.min_deposit[0].amount));
      }
    };
    feachgetMinDeposit();
    feachData();
  }, []);

  const feachData = async () => {
    const responseProposals = await getProposals();
    if (responseProposals !== null) {
      setTableData(responseProposals);
    }
  };

  const active = tableData
    .reverse()
    .filter(
      item =>
        item.proposal_status !== 'Passed' && item.proposal_status !== 'Rejected'
    )
    .map(item => (
      <Link style={{ color: 'unset' }} to={`/governance/${item.id}`}>
        <ActiveCard
          key={item.id}
          id={item.id}
          name={item.content.value.title}
          minDeposit={minDeposit}
          totalDeposit={parseFloat(item.total_deposit[0].amount)}
          state={item.proposal_status}
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
    .filter(item => item.proposal_status === 'Passed')
    .map(item => (
      <Link style={{ color: 'unset' }} to={`/governance/${item.id}`}>
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
    .filter(item => item.proposal_status === 'Rejected')
    .map(item => (
      <Link style={{ color: 'unset' }} to={`/governance/${item.id}`}>
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
      <ActionBar update={feachData} />
    </div>
  );
}

export default Governance;
