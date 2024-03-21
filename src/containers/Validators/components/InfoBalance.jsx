import { Link } from 'react-router-dom';
import { Pane } from '@cybercongress/gravity';
import { CardStatisics, Dots } from '../../../components';
import { formatNumber } from '../../../utils/utils';
import { CYBER } from '../../../utils/config';
import { DENOM_LIQUID } from 'src/constants/config';

const { DENOM, HYDROGEN } = CYBER;

function TootipContent() {
  return (
    <div style={{ width: 200 }}>
      you receive H form staked BOOT, you can use H for investmint A and V
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
        title={`${DENOM.toUpperCase()} staked`}
        value={
          loadingBalanceInfo ? (
            <Dots />
          ) : (
            formatNumber(balance.delegation ? balance.delegation : 0)
          )
        }
      />

      <CardStatisics
        title={`${DENOM.toUpperCase()} available`}
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
          title={`${HYDROGEN} available`}
          value={
            loadingBalanceInfo ? (
              <Dots />
            ) : (
              formatNumber(
                balanceToken[DENOM_LIQUID]
                  ? balanceToken[DENOM_LIQUID].liquid
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
        title={`${DENOM.toUpperCase()} rewards`}
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
