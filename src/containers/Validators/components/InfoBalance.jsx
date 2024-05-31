import { Link } from 'react-router-dom';
import { Pane } from '@cybercongress/gravity';
import { CardStatisics, Dots, DenomArr } from '../../../components';
import { formatNumber } from '../../../utils/utils';
import { DENOM_LIQUID, BASE_DENOM } from 'src/constants/config';

function TootipContent() {
  return (
    <div style={{ width: 200 }}>
      you receive {DENOM_LIQUID} form staked {BASE_DENOM}, you can use {DENOM_LIQUID} for investmint A and V
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
        title={`${BASE_DENOM.toUpperCase()} staked`}
        value={
          loadingBalanceInfo ? (
            <Dots />
          ) : (
            formatNumber(balance.delegation ? balance.delegation : 0)
          )
        }
      />

      <CardStatisics
        title={`${BASE_DENOM.toUpperCase()} available`}
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
          title={
            <span>
              <DenomArr denomValue={DENOM_LIQUID} />
              available
            </span>
          }
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
        title={`${BASE_DENOM.toUpperCase()} rewards`}
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
