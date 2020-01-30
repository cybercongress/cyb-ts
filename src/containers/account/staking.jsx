import React from 'react';
import { Pane, Text } from '@cybercongress/gravity';
import CardTemplate from './cardTemplate';
import { Account } from '../../components';
import { formatNumber, formatCurrency } from '../../utils/utils';
import { CYBER } from '../../utils/config';

const dateFormat = require('dateformat');

const noitem = require('../../image/noitem.svg');

const Img = ({ img }) => (
  <img style={{ width: '45px', height: '45px' }} src={img} alt="img" />
);

const Noitem = ({ text }) => (
  <Pane display="flex" paddingY={40} alignItems="center" flexDirection="column">
    <Img img={noitem} />
    <Text fontSize="18px" color="#fff">
      {text}
    </Text>
  </Pane>
);

const Staking = ({ data, ...props }) => {
  console.log(data.unbonding);
  const delegations = data.delegations.map(item => (
    <Pane key={item.validator_address} display="flex" marginBottom={10}>
      <Pane flex={1}>
        <Account address={item.validator_address} />
      </Pane>
      <Pane>
        {formatCurrency(
          parseFloat(item.balance),
          CYBER.DENOM_CYBER.toUpperCase()
        )}
      </Pane>
    </Pane>
  ));

  const unbondings = data.unbonding.map(unbond => (
    <Pane key={unbond.validator_address} display="flex" marginBottom={10}>
      <Pane flex="calc(12 / 5)">
        <Account address={unbond.validator_address} />
      </Pane>
      <Pane display="flex" flex="calc(12 / 7)" flexDirection="column">
        {unbond.entries.map(entry => (
          <Pane marginBottom={5} display="flex" key={entry.completion_time}>
            <Pane textAlign="end" paddingX={5} flex="calc(12 / 6)">
              {formatCurrency(
                parseFloat(entry.balance),
                CYBER.DENOM_CYBER.toUpperCase()
              )}
            </Pane>
            <Pane textAlign="end" paddingX={5} flex="calc(12 / 6)">
              {dateFormat(entry.completion_time, 'dd/mm/yy')}
            </Pane>
          </Pane>
        ))}
      </Pane>
    </Pane>
  ));

  return (
    <Pane
      display="grid"
      gridGap="20px"
      gridTemplateColumns="repeat(auto-fit, minmax(450px, 1fr))"
      {...props}
    >
      <CardTemplate paddingBottom={10} title="Delegations">
        {delegations.length > 0 ? (
          <Pane>
            <Pane display="flex" marginBottom={10}>
              <Pane flex={1}>Validator</Pane>
              <Pane>Amount</Pane>
            </Pane>
            <Pane>{delegations}</Pane>
          </Pane>
        ) : (
          <Noitem text="No Delegations" />
        )}
      </CardTemplate>
      <CardTemplate paddingBottom={10} title="Unbondings">
        {unbondings.length > 0 ? (
          <Pane>
            <Pane display="flex" marginBottom={10}>
              <Pane flex="calc(12 / 5)">Validator</Pane>
              <Pane display="flex" flex="calc(12 / 7)">
                <Pane textAlign="end" paddingX={5} flex="calc(12 / 6)">
                  Amount
                </Pane>
                <Pane textAlign="end" paddingX={5} flex="calc(12 / 6)">
                  Mature
                </Pane>
              </Pane>
            </Pane>
            <Pane>{unbondings}</Pane>
          </Pane>
        ) : (
          <Noitem text="No Unbondings" />
        )}
      </CardTemplate>
    </Pane>
  );
};

export default Staking;
