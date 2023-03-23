import React from 'react';
import { connect } from 'react-redux';
import { Tooltip } from '../../components';
import { formatNumber } from '../../utils/utils';
import { CYBER } from '../../utils/config';

const circleYellow = require('../../image/large-yellow-circle.png');

function LeftTooltip({ block }) {
  return (
    <Tooltip
      placement="bottom"
      tooltip={
        <span style={{ width: '225px', display: 'block' }}>
          You are on the{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/cybercongress/cyberd/releases"
          >
            {CYBER.CHAIN_ID}
          </a>{' '}
          network at block{' '}
          <span style={{ color: '#4ed6ae' }}>
            <a href="/network/bostrom/block">
              {formatNumber(parseFloat(block))}
            </a>
          </span>
        </span>
      }
    >
      <img
        alt="bugs"
        style={{ width: '17px', objectFit: 'contain' }}
        src={circleYellow}
      />
    </Tooltip>
  );
}

const mapStateToProps = (store) => {
  return {
    block: store.block.block,
  };
};

export default connect(mapStateToProps)(LeftTooltip);
