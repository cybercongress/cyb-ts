import React from 'react';
import { Pane, Text, Tooltip } from '@cybercongress/gravity';
import { CardTemplate, Account } from '../../components';
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

const Unbondings = ({ data, ...props }) => {
  const unbondings = data.unbonding.map(unbond => (
    <Pane key={unbond.validator_address} display="flex" marginBottom={10}>
      <Pane flex="calc(12 / 5)">
        <Account address={unbond.validator_address} />
      </Pane>
      <Pane display="flex" flex="calc(12 / 7)" flexDirection="column">
        {unbond.entries.map(entry => (
          <Pane marginBottom={5} display="flex" key={entry.completion_time}>
            <Tooltip
              content={`${formatNumber(
                parseFloat(entry.balance)
              )} ${CYBER.DENOM_CYBER.toUpperCase()}`}
              position="bottom"
            >
              <Pane textAlign="end" paddingX={5} flex="calc(12 / 6)">
                {formatCurrency(
                  parseFloat(entry.balance),
                  CYBER.DENOM_CYBER.toUpperCase()
                )}
              </Pane>
            </Tooltip>

            <Pane textAlign="end" paddingX={5} flex="calc(12 / 6)">
              {dateFormat(entry.completion_time, 'dd/mm/yy')}
            </Pane>
          </Pane>
        ))}
      </Pane>
    </Pane>
  ));

  return (
    <Pane display="grid" gridGap="20px" gridTemplateColumns="1fr" {...props}>
      <CardTemplate paddingBottom={10} paddingLeftChild={10} title="Unbondings">
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

export default Unbondings;
