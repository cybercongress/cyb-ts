import { Pane, Text } from '@cybercongress/gravity';
import {
  IconStatus,
  Votes,
  Deposit,
  ContainerGradientText,
} from '../../components';
import { formatNumber } from '../../utils/search/utils';
import { CYBER } from '../../utils/config';

const iconPie = require('../../image/ionicons_svg_ios-pie.svg');
const iconPieActive = require('../../image/ionicons_svg_ios-pie-active.svg');

//TODO: Move to utils
const toFixedNumber = (number, toFixed) => {
  return Math.floor(number * 10 ** toFixed) / 10 ** toFixed;
};

function ProposalsDetailProgressBar({
  proposals,
  totalDeposit,
  minDeposit,
  tallying,
  tally,
}) {
  const { quorum, threshold, veto } = tallying;
  const { yes, abstain, no, noWithVeto, participation } = tally;

  return (
    <Pane
      display="grid"
      gridTemplateColumns="repeat(auto-fit, minmax(450px, 1fr))"
      gridGap={20}
    >
      <ContainerGradientText
        display="flex"
        // alignItems="center"
        // justifyContent="space-between"
        flexDirection="column"
        minHeight={140}
        // height={2}
      >
        {proposals.status && (
          <IconStatus
            status={proposals.status}
            text
            marginRight={8}
            marginBottom={20}
          />
        )}
        <Pane
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text marginX={5} color="#fff">
            0
          </Text>
          <Deposit totalDeposit={totalDeposit} minDeposit={minDeposit} />
          <Text marginX={5} color="#fff" whiteSpace="nowrap">
            {formatNumber(minDeposit)} {CYBER.DENOM_CYBER.toUpperCase()}{' '}
            MinDeposit
          </Text>
        </Pane>
      </ContainerGradientText>

      <ContainerGradientText>
        <Pane display="flex" marginBottom={25}>
          <Pane display="flex" alignItems="center" marginRight={15}>
            <img
              style={{ width: 20, marginRight: 5 }}
              src={participation > quorum * 100 ? iconPieActive : iconPie}
              alt="pie"
            />
            <Text color="#c7c7c7">
              Participation {toFixedNumber(quorum * 100, 2)}%
            </Text>
          </Pane>
          <Pane display="flex" alignItems="center" marginRight={15}>
            <img
              style={{ width: 20, marginRight: 5 }}
              src={yes > threshold * 100 ? iconPieActive : iconPie}
              alt="pie"
            />
            <Text color="#c7c7c7">
              Yes {toFixedNumber(threshold * 100, 2)}%
            </Text>
          </Pane>
          <Pane display="flex" alignItems="center" marginRight={15}>
            <img
              style={{ width: 20, marginRight: 5 }}
              src={noWithVeto > veto * 100 ? iconPieActive : iconPie}
              alt="pie"
            />
            <Text color="#c7c7c7">
              NoWithVeto {toFixedNumber(veto * 100, 2)}%
            </Text>
          </Pane>
        </Pane>
        <Pane display="flex" justifyContent="space-between" alignItems="center">
          <Pane display="flex" flexDirection="column">
            <Text
              whiteSpace="nowrap"
              color="#fff"
              marginX={5}
              marginY={5}
            >{`Yes: ${toFixedNumber(yes, 2)}%`}</Text>
            <Text
              whiteSpace="nowrap"
              color="#fff"
              marginX={5}
              marginY={5}
            >{`No: ${toFixedNumber(no, 2)}%`}</Text>
          </Pane>
          <Votes finalVotes={tally} />
          <Pane display="flex" flexDirection="column">
            <Text
              whiteSpace="nowrap"
              color="#fff"
              marginX={5}
              marginY={5}
            >{`Abstain: ${toFixedNumber(abstain, 2)}%`}</Text>
            <Text
              whiteSpace="nowrap"
              color="#fff"
              marginX={5}
              marginY={5}
            >{`NoWithVeto: ${toFixedNumber(noWithVeto, 2)}%`}</Text>
          </Pane>
        </Pane>
      </ContainerGradientText>
    </Pane>
  );
}

export default ProposalsDetailProgressBar;
