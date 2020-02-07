import React from 'react';
import { Pane, Text } from '@cybercongress/gravity';
import { formatNumber as format } from '../../utils/search/utils';
import { Account, Link } from '../../components';

import { CYBER } from '../../utils/config';

const giftImg = require('../../image/gift.svg');

const KEY_NAME = {
  'euler-4_from': 'euler-4 from',
  cosmos_bal: 'cosmos balance',
  cosmos_gift: 'cosmos gift',
  ethereum_bal: 'eth balance',
  ethereum_gift: 'eth gift',
  galaxies_bal: 'galaxies',
  galaxies_gift: 'galaxies gift',
  stars_bal: 'stars',
  stars_gift: 'stars gift',
  planets_bal: 'planets',
  planets_gift: 'planets gift',
};

const SnipitAccount = ({ to, text, address, children }) => {
  return (
    <Link to={`#${to}`}>
      <Pane
        backgroundColor="#fff"
        paddingY={20}
        paddingX={20}
        borderRadius={5}
        key={address}
        display="flex"
        flexDirection="row"
        marginBottom={15}
        color="#000"
      >
        <Pane display="flex" flexDirection="column" marginRight={10}>
          <Pane>{text}</Pane>
          <Pane>{children || address}</Pane>
        </Pane>
      </Pane>
    </Link>
  );
};

export default SnipitAccount;
