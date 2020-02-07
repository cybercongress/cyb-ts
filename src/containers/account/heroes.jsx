import React from 'react';
import { Pane, Text, Tooltip } from '@cybercongress/gravity';
import { CardTemplate, Account } from '../../components';
import { formatNumber, formatCurrency } from '../../utils/utils';
import { CYBER } from '../../utils/config';

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

const Heroes = ({ data, ...props }) => {
  const delegations = data.delegations.map(item => (
    <Pane key={item.validator_address} display="flex" marginBottom={10}>
      <Pane flex={1}>
        <Account address={item.validator_address} />
      </Pane>
      <Tooltip
        content={`${formatNumber(
          parseFloat(item.balance)
        )} ${CYBER.DENOM_CYBER.toUpperCase()}`}
        position="bottom"
      >
        <Pane>
          {formatCurrency(
            parseFloat(item.balance),
            CYBER.DENOM_CYBER.toUpperCase()
          )}
        </Pane>
      </Tooltip>
    </Pane>
  ));

  return (
    <Pane display="grid" gridGap="20px" gridTemplateColumns="1fr" {...props}>
      <CardTemplate paddingBottom={10} paddingLeftChild={10} title="Heroes">
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
    </Pane>
  );
};

export default Heroes;
