import React from 'react';
import { Text, Pane } from '@cybercongress/gravity';
import { formatNumber } from '../../utils/search/utils';

const dateFormat = require('dateformat');
const statusTrueImg = require('../../image/ionicons_svg_ios-checkmark-circle.svg');
const statusFalseImg = require('../../image/ionicons_svg_ios-close-circle.svg');

const InformationTxs = ({ data, ...props }) => {
  const value = Object.keys(data).map(key => {
    let item = '';
    switch (key) {
      case 'height':
        item = formatNumber(data[key]);
        break;
      case 'status':
        item = data[key] ? 'Success' : 'Fail';
        break;
      case 'timestamp':
        item = dateFormat(data[key], 'dd/mm/yyyy, h:MM:ss TT');
        break;
      default:
        item = data[key];
        break;
    }

    return (
      <Pane
        key={`${key}-container`}
        className="txs-contaiter-row"
        display="flex"
      >
        <Text
          key={`${key}-title`}
          display="flex"
          fontSize="16px"
          textTransform="capitalize"
          color="#fff"
          whiteSpace="nowrap"
          width="240px"
          marginBottom="5px"
          lineHeight="20px"
        >
          {key} :
        </Text>
        <Text
          key={`${key}-value`}
          display="flex"
          color="#fff"
          fontSize="16px"
          alignItems="center"
          wordBreak="break-all"
          lineHeight="20px"
          marginBottom="5px"
        >
          {key === 'status' && (
            <img
              style={{ width: '20px', height: '20px', marginRight: '5px' }}
              src={data[key] ? statusTrueImg : statusFalseImg}
              alt="statusImg"
            />
          )}
          {item}
        </Text>
      </Pane>
    );
  });

  return (
    <Pane
      paddingY={20}
      paddingX={20}
      borderRadius={5}
      display="flex"
      flexDirection="column"
      boxShadow="0 0 5px #3ab793"
      {...props}
    >
      <Pane
        paddingX={0}
        paddingTop={5}
        paddingBottom={10}
        borderBottom="1px solid #3ab7938f"
      >
        <Text color="#fff" fontSize="20px" fontWeight="500" lineHeight="1.5">
          Information
        </Text>
      </Pane>
      <Pane display="flex" paddingTop={20} width="100%" flexDirection="column">
        {value}
      </Pane>
    </Pane>
  );
};

export default InformationTxs;
