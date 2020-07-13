import React from 'react';
import { Pane, Text } from '@cybercongress/gravity';
import { Link } from 'react-router-dom';
import { formatNumber as format } from '../../utils/search/utils';
import { Account } from '../../components';

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

const SnipitAccount = ({ to, text, content, children }) => {
  return (
    <Link to={`${to}`}>
      <Pane
        backgroundColor="#fff"
        paddingY={20}
        paddingX={20}
        borderRadius={5}
        key={content}
        display="flex"
        flexDirection="row"
        marginBottom={15}
        color="#000"
      >
        <Pane display="flex" flexDirection="column" marginRight={10}>
          <Pane fontSize="16px">{text}</Pane>
          <Pane fontSize="16px" lineHeight="25px">
            {children || content}
          </Pane>
        </Pane>
      </Pane>
    </Link>
  );
};

export default SnipitAccount;
