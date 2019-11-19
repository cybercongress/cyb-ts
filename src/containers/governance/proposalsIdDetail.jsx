import React from 'react';
import { Pane, Text } from '@cybercongress/gravity';
import { IconStatus, ContainerPane, Item } from '../../components';
import { formatNumber } from '../../utils/search/utils';

const toFixedNumber = (number, toFixed) => {
  return Math.floor(number * 10 ** toFixed) / 10 ** toFixed;
};

const ProposalsIdDetail = ({
  totalDeposit,
  time,
  proposalStatus,
  tallying,
  tally,
  ...props
}) => {
  const { submitTime, depositEndTime, votingStartTime, votingEndTime } = time;
  const { yes, abstain, no, noWithVeto, participation } = tally;
  const { quorum, threshold, veto } = tallying;

  return (
    <Pane
      display="grid"
      gridTemplateColumns="repeat(auto-fit, minmax(450px, 1fr))"
      gridGap={20}
      {...props}
    >
      <ContainerPane>
        <Item marginBottom={15} title="Submit Time" value={submitTime} />
        <Item
          marginBottom={15}
          title="Deposit Endtime"
          value={depositEndTime}
        />
        <Item
          marginBottom={15}
          title="Total Deposit"
          value={`${formatNumber(totalDeposit * 10 ** -9)} GCYB`}
        />
        <Item
          marginBottom={15}
          title="Voting Starttime"
          value={votingStartTime}
        />
        <Item title="Voting Endtime" value={votingEndTime} />
      </ContainerPane>

      <ContainerPane>
        <Item
          marginBottom={15}
          title="Status"
          value={
            <Pane display="flex">
              <IconStatus status={proposalStatus} marginRight={8} />
              <Text color="#fff">{proposalStatus}</Text>
            </Pane>
          }
        />
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
          value={`${yes}% (Threshold ${toFixedNumber(threshold * 100, 2)}%)`}
        />
        <Item marginBottom={15} title="No" value={`${no}%`} />
        <Item
          marginBottom={15}
          title="NoWithVeto"
          value={`${noWithVeto}% (Threshold ${toFixedNumber(veto * 100, 2)}%)`}
        />
        <Item title="Abstain" value={`${abstain}%`} />
      </ContainerPane>
    </Pane>
  );
};

export default ProposalsIdDetail;
