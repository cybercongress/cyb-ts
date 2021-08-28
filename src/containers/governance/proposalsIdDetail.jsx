import React from 'react';
import { Pane, Text } from '@cybercongress/gravity';
import { IconStatus, ContainerPane, Item } from '../../components';
import { formatNumber } from '../../utils/search/utils';
import { CYBER } from '../../utils/config';

const dateFormat = require('dateformat');

const toFixedNumber = (number, toFixed) => {
  return Math.floor(number * 10 ** toFixed) / 10 ** toFixed;
};

const formatTime = (time) =>
  dateFormat(new Date(time), 'dd/mm/yyyy, hh:MM:ss TT');

const ProposalsIdDetail = ({
  totalDeposit,
  proposals,
  tallying,
  tally,
  ...props
}) => {
  const { yes, abstain, no, noWithVeto, participation } = tally;
  const { quorum, threshold, veto_threshold: veto } = tallying;

  return (
    <Pane
      display="grid"
      gridTemplateColumns="repeat(auto-fit, minmax(450px, 1fr))"
      gridGap={20}
      {...props}
    >
      <ContainerPane>
        {proposals.submit_time && (
          <Item
            marginBottom={15}
            title="Submit Time"
            value={formatTime(proposals.submit_time)}
          />
        )}
        {proposals.deposit_end_time && (
          <Item
            marginBottom={15}
            title="Deposit Endtime"
            value={formatTime(proposals.deposit_end_time)}
          />
        )}
        {totalDeposit && (
          <Item
            marginBottom={15}
            title="Total Deposit"
            value={`${formatNumber(totalDeposit)} ${CYBER.DENOM_CYBER}`}
          />
        )}
        {proposals.voting_start_time && (
          <Item
            marginBottom={15}
            title="Voting Starttime"
            value={formatTime(proposals.voting_start_time)}
          />
        )}
        {proposals.voting_end_time && (
          <Item
            title="Voting Endtime"
            value={formatTime(proposals.voting_end_time)}
          />
        )}
      </ContainerPane>

      <ContainerPane>
        {proposals.status && (
          <Item
            marginBottom={15}
            title="Status"
            value={
              <IconStatus status={proposals.status} text marginRight={8} />
            }
          />
        )}
        <Item
          marginBottom={15}
          title="Participation"
          value={`${toFixedNumber(participation, 2)}% (Quorum ${toFixedNumber(
            quorum * 100,
            2
          )}%)`}
        />
        <Item
          marginBottom={15}
          title="Yes"
          value={`${toFixedNumber(yes, 2)}% (Threshold ${toFixedNumber(
            threshold * 100,
            2
          )}%)`}
        />
        <Item marginBottom={15} title="No" value={`${toFixedNumber(no, 2)}%`} />
        <Item
          marginBottom={15}
          title="NoWithVeto"
          value={`${toFixedNumber(noWithVeto, 2)}% (Threshold ${toFixedNumber(
            veto * 100,
            2
          )}%)`}
        />
        <Item title="Abstain" value={`${toFixedNumber(abstain, 2)}%`} />
      </ContainerPane>
    </Pane>
  );
};

export default ProposalsIdDetail;
