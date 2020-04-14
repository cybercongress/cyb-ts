import React from 'react';
import { Pane, Text } from '@cybercongress/gravity';
import { CardTemplate } from '../../components';
import { trimString, formatNumber } from '../../utils/utils';

const dateFormat = require('dateformat');

export const Row = ({ value, title, marginBottom }) => (
  <Pane
    key={`${value}-container`}
    style={{ marginBottom: marginBottom || 0 }}
    className="txs-contaiter-row"
    display="flex"
  >
    <Text
      key={`${title}-title`}
      display="flex"
      fontSize="16px"
      textTransform="capitalize"
      color="#fff"
      whiteSpace="nowrap"
      width="240px"
      marginBottom="5px"
      lineHeight="20px"
    >
      {title} :
    </Text>
    <Text
      key={`${value}-value`}
      display="flex"
      color="#fff"
      fontSize="16px"
      wordBreak="break-all"
      lineHeight="20px"
      marginBottom="5px"
      flexDirection="column"
      alignItems="flex-start"
    >
      {value}
    </Text>
  </Pane>
);

const InformationBlock = ({ data, numbTx, marginBottom }) => {
  return (
    <CardTemplate
      marginBottom={marginBottom}
      paddingBottom={20}
      title="Information"
    >
      <Row value={formatNumber(data.height)} title="Height" />
      <Row
        value={dateFormat(data.timestamp, 'dd/mm/yyyy, HH:MM:ss')}
        title="Block Time"
      />
      <Row value={trimString(data.hash, 6, 6)} title="Block Hash" />
      <Row value={Object.keys(numbTx).length} title="Number of Transactions" />
    </CardTemplate>
  );
};

export default InformationBlock;
