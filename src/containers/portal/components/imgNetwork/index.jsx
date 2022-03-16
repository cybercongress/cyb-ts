import React from 'react';
import {
  PATTERN_COSMOS,
  PATTERN_CYBER,
  PATTERN_ETH,
} from '../../../../utils/config';

import styles from './styles.scss';

const classNames = require('classnames');

const imgEth = require('../../../../image/Ethereum_logo_2014.svg');
const imgBostrom = require('../../../../image/large-green.png');
const imgCosmos = require('../../../../image/cosmos-2.svg');
const defaultImg = require('../../../../image/large-yellow-circle.png');
const imgHome = require('../../../../image/home-icon.png');

const ParseAddressesImg = ({ address, active, ...props }) => {
  let img = defaultImg;

  if (address.match(PATTERN_ETH)) {
    img = imgEth;
  }

  if (address.match(PATTERN_COSMOS)) {
    img = imgCosmos;
  }

  if (address.match(PATTERN_CYBER)) {
    img = imgBostrom;
  }

  return (
    <button className={styles.ButtonIconNetwork} type="button" {...props}>
      <img src={img} alt="img" />
      {address.match(PATTERN_CYBER) && (
        <img className={styles.IconHome} src={imgHome} alt="img" />
      )}
      {active && (
        <>
          <div
            className={classNames(
              styles.textboxFace,
              styles.textboxBottomGradient
            )}
          />
          <div className={classNames(styles.textboxBottomLine)} />
        </>
      )}
    </button>
  );
};

export default ParseAddressesImg;
