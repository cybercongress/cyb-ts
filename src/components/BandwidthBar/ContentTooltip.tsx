import { Pane, Text } from '@cybercongress/gravity';
import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from 'src/routes';
import { Networks } from 'src/types/networks';
import { CYBER } from '../../utils/config';
import getBatteryMessage from './getBatteryMessage';
import { ContentTooltipProps } from './type';

function ContentTooltip({
  bwMaxValue,
  amounPower,
  countLink,
}: ContentTooltipProps) {
  const text = getBatteryMessage({ bwMaxValue, amounPower, countLink });

  return (
    <Pane zIndex={4} paddingX={10} paddingY={10} maxWidth={200}>
      <Pane marginBottom={12}>
        <Text color="#fff" size={400}>
          {text}
          <Link
            to={
              CYBER.CHAIN_ID === Networks.BOSTROM
                ? routes.search.getLink('get BOOT')
                : routes.teleport.path
            }
          >
            Get {CYBER.DENOM_CYBER.toUpperCase()}
          </Link>
        </Text>
      </Pane>
    </Pane>
  );
}

export default React.memo(ContentTooltip);
