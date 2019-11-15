import React from 'react';
import { Pane, Text, TableEv as Table } from '@cybercongress/gravity';
// import { formatNumber } from '../../utils/search/utils';
import proposals from './test';
// import { getProposals } from '../../utils/governance';

const dateFormat = require('dateformat');

const toFixedNumber = (number, toFixed) => {
  return Math.floor(number * 10 ** toFixed) / 10 ** toFixed;
};

class ProposalsDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      table: [],
    };
  }

  render() {
    const { table } = this.state;
    const { match } = this.props;
    const proposalId = match.params.proposal_id;

    return (
      <main className="block-body-home">
        <Pane>
          <Text color="#fff">{proposalId} proposal Id</Text>
        </Pane>
      </main>
    );
  }
}

export default ProposalsDetail;
