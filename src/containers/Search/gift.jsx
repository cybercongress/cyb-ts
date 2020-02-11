import React from 'react';
import { Pane, Text } from '@cybercongress/gravity';
import { formatNumber as format } from '../../utils/search/utils';

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

const Gift = ({ item }) => {
  return (
    <Pane
      backgroundColor="#fff"
      paddingY={20}
      paddingX={20}
      borderRadius={5}
      key={item.address}
      display="flex"
      flexDirection="row"
      marginBottom={15}
    >
      <Pane display="flex" flexDirection="column" marginRight={10}>
        {Object.keys(item).map(key => (
          <Text
            key={key}
            display="flex"
            fontSize="16px"
            color="#000"
            lineHeight="25px"
          >
            {KEY_NAME[key] || key}{' '}
            {key === 'gift' && (
              <img
                style={{ width: '25px', height: '25px', marginLeft: '5px' }}
                src={giftImg}
                alt="giftImg"
              />
            )}
            :
          </Text>
        ))}
      </Pane>
      <Pane display="flex" flexDirection="column">
        {Object.keys(item).map(key => (
          <Text
            key={key}
            display="flex"
            fontSize="14px"
            color="#000"
            lineHeight="25px"
          >
            {key.indexOf('address') !== -1 ? item[key] : format(item[key])}{' '}
            {(key.indexOf('gift') !== -1 || key.indexOf('euler-4') !== -1) &&
              CYBER.DENOM_CYBER.toUpperCase()}
          </Text>
        ))}
      </Pane>
    </Pane>
  );
};

export default Gift;
