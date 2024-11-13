import { Pane } from '@cybercongress/gravity';
import { BASE_DENOM } from 'src/constants/config';
import { CardStatisics, Dots } from '../../../components';
import { formatNumber } from '../../../utils/utils';

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

function InfoBalance({ balance, loadingBalanceInfo, apr }) {
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

      {apr && <CardStatisics title="APR, %" value={formatNumber(apr)} />}
    </ContainerGrid>
  );
}

export default InfoBalance;
