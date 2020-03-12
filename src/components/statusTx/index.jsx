import React from 'react';

const statusTrueImg = require('../../image/ionicons_svg_ios-checkmark-circle.svg');
const statusFalseImg = require('../../image/ionicons_svg_ios-close-circle.svg');

const StatusTx = ({ code }) => {
  return (
    <img
      style={{ width: '20px', height: '20px', marginRight: '5px' }}
      src={code === 0 ? statusTrueImg : statusFalseImg}
      alt="statusImg"
    />
  );
};

export default StatusTx;
