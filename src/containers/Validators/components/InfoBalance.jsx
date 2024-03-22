import { Link } from 'react-router-dom';
import { Pane } from '@cybercongress/gravity';
import { CardStatisics, Dots } from '../../../components';
import { formatNumber } from '../../../utils/utils';
import { CYBER } from '../../../utils/config';

const { DENOM_CYBER, HYDROGEN } = CYBER;

function TootipContent() {
  return (
    <div style={{ width: 200 }}>
      you receive LP form staked {CYBER.DENOM_CYBER}, you can use LP for investmint A and V
    </div>
  );
}

function ContainerGrid({ children }) {
  return (
    <Pane
      marginTop={10}
      marginBottom={50}
      display="grid"
      gridTemplateColumns="repeat(auto-fit, minmax(220px, 1fr))"
      gridGap="20px"
    >
      {children}
    </Pane>
  );
}

function InfoBalance({ balance, loadingBalanceInfo, balanceToken }) {
  return (
    <ContainerGrid>
      <CardStatisics
        title={`${DENOM_CYBER.toUpperCase()} staked`}
        value={
          loadingBalanceInfo ? (
            <Dots />
          ) : (
            formatNumber(balance.delegation ? balance.delegation : 0)
          )
        }
      />

      <CardStatisics
        title={`${DENOM_CYBER.toUpperCase()} available`}
        value={
          loadingBalanceInfo ? (
            <Dots />
          ) : (
            formatNumber(balance.available ? balance.available : 0)
          )
        }
      />

      <Link to="/hfr">
        <CardStatisics
          title={`LP available`}
          value={
            loadingBalanceInfo ? (
              <Dots />
            ) : (
              formatNumber(
                balanceToken[CYBER.DENOM_LIQUID_TOKEN]
                  ? balanceToken[CYBER.DENOM_LIQUID_TOKEN].liquid
                  : 0
              )
            )
          }
          tooltipValue={<TootipContent />}
          positionTooltip="bottom"
          styleTitle={{ alignItems: 'center' }}
        />
      </Link>

      <CardStatisics
        title={`${DENOM_CYBER.toUpperCase()} rewards`}
        value={
          loadingBalanceInfo ? (
            <Dots />
          ) : (
            formatNumber(balance.rewards ? balance.rewards : 0)
          )
        }
      />
    </ContainerGrid>
  );
}

export default InfoBalance;
