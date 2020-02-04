import React, { useState } from 'react';
import { Pane, Text } from '@cybercongress/gravity';
import {
  CardTemplate,
  Link,
  StatusTooltip,
  FormatNumber,
  Tooltip,
  Account,
} from '../../components';
import { formatNumber, formatCurrency } from '../../utils/utils';
import { CYBER } from '../../utils/config';

const imgDropdown = require('../../image/arrow-dropdown.svg');
const imgDropup = require('../../image/arrow-dropup.svg');

const Delegators = ({ data }) => {
  const [seeAll, setSeeAll] = useState(false);

  console.log('data', data);

  const delegations = data.slice(0, seeAll ? data.length : 5).map(item => (
    <Pane key={item.delegator_address} display="flex" marginBottom={10}>
      <Pane flex={1}>
        <Account address={item.delegator_address} />
      </Pane>

      <Pane>
        <Tooltip
          placement="bottom"
          tooltip={`${formatNumber(
            Math.floor(item.balance)
          )} ${CYBER.DENOM_CYBER.toUpperCase()}`}
        >
          {formatCurrency(
            parseFloat(item.balance),
            CYBER.DENOM_CYBER.toUpperCase()
          )}
        </Tooltip>
      </Pane>
    </Pane>
  ));

  return (
    <CardTemplate paddingBottom={20} paddingLeftChild={10} title="Delegators">
      <Pane>
        <Pane display="flex" marginBottom={10}>
          <Pane flex={1}>Delegator Address ({data.length})</Pane>
          <Pane>Amount</Pane>
        </Pane>
        <Pane>{delegations}</Pane>
      </Pane>
      {data.length > 5 && (
        <button
          style={{
            width: '25px',
            height: '25px',
            margin: 0,
            padding: 0,
            border: 'none',
            backgroundColor: 'transparent',
          }}
          type="button"
          onClick={() => setSeeAll(!seeAll)}
        >
          <img src={!seeAll ? imgDropdown : imgDropup} alt="imgDropdown" />
        </button>
      )}
    </CardTemplate>
  );
};

export default Delegators;
