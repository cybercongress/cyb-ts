import React, { useMemo } from 'react';
import { Pane } from '@cybercongress/gravity';
import { Denom } from '../../../components';
import FormatNumberTokens from '../../nebula/components/FormatNumberTokens';

const PoolItemsList = ({ assets, token, ...props }) => {
  const amounToken = useMemo(() => {
    if (assets && Object.prototype.hasOwnProperty.call(assets, token)) {
      const amount = assets[token];
      return amount;
    }
    return 0;
  }, [assets, token]);

  return (
    <Pane
      display="flex"
      alignItems="baseline"
      justifyContent="space-between"
      marginBottom={10}
      {...props}
    >
      <Denom
        style={{
          flexDirection: 'row-reverse',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        denomValue={token}
        marginImg="0 5px"
      />
      <FormatNumberTokens value={amounToken} />
    </Pane>
  );
};

export default PoolItemsList;
