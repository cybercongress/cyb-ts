import React from 'react';
import { Pane, Text, Tooltip, Pill } from '@cybercongress/gravity';

const StatusTooltip = ({ status, size }) => {
  let statusColor;

  switch (status) {
    case 0:
      statusColor = 'red';
      break;
    case 1:
      statusColor = 'yellow';
      break;
    case 2:
      statusColor = 'green';
      break;
    default:
      statusColor = 'neutral';
      break;
  }

  return (
    <Pane display="flex" alignItems="center">
      <Tooltip
        appearance="card"
        content={
          <Pane display="flex" alignItems="center" paddingX={18} paddingY={18}>
            <Text>
              Validator status:&nbsp;
              {status === 0 && 'unbonded'}
              {status === 1 && 'unbonding'}
              {status === 2 && 'bonded'}
            </Text>
          </Pane>
        }
      >
        <Pill
          height={size || 7}
          width={size || 7}
          borderRadius="50%"
          paddingX={4}
          paddingY={0}
          // marginX={20}
          isSolid
          color={statusColor}
        />
      </Tooltip>
    </Pane>
  );
};

export default StatusTooltip;
