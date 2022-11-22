import React from 'react';
import { Link } from 'react-router-dom';
import { Pane } from '@cybercongress/gravity';
import { CardStatisics, Dots } from '../../../components';
import { formatNumber } from '../../../utils/utils';
import { CYBER } from '../../../utils/config';

const { DENOM_CYBER, HYDROGEN } = CYBER;

const TootipContent = () => (
  <span style={{ padding: '5px' }}>
    you receive H form staked BOOT, you can use H for investmint A and V
  </span>
);

const ContainerGrid = ({ children }) => (
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

      <Link to="/mint">
        <CardStatisics
          title={`${HYDROGEN} available`}
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
