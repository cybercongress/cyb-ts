import React from 'react';
import { Text, TableEv as Table } from '@cybercongress/gravity';

const RowTable = ({
  text,
  reward,
  currentPrize,
  cybWonAbsolute,
  cybWonPercent,
}) => (
  <Table.Row borderBottom="none">
    <Table.TextCell>
      <Text fontSize="16px" color="#fff">
        {text}
      </Text>
    </Table.TextCell>
    <Table.TextCell textAlign="end">
      <Text fontSize="16px" color="#fff">
        {reward}
      </Text>
    </Table.TextCell>
    <Table.TextCell textAlign="end">
      <Text fontSize="16px" color="#fff">
        {/* {Math.floor((won / DISTRIBUTION.takeoff) * DISTRIBUTION[key])} */}
        {currentPrize}
      </Text>
    </Table.TextCell>
    <Table.TextCell textAlign="end">
      <Text fontSize="16px" color="#fff">
        {/* {Math.floor((won / DISTRIBUTION.takeoff) * DISTRIBUTION[key])} */}
        {cybWonAbsolute}
      </Text>
    </Table.TextCell>
    <Table.TextCell textAlign="end">
      <Text fontSize="16px" color="#fff">
        {/* {Math.floor((won / DISTRIBUTION.takeoff) * DISTRIBUTION[key])} */}
        {cybWonPercent}
      </Text>
    </Table.TextCell>
  </Table.Row>
);

export default RowTable;
