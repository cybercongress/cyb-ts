import React from 'react';
import { CardStatisics } from '../../../components';
import { formatCurrency } from '../../../utils/utils';
import { CYBER } from '../../../utils/config';

function PowerTab() {
  try {
    return (
      <>
        <CardStatisics
          title="max slots"
          // value={formatNumber(cidsCount)}
          value={8}
        />

        <CardStatisics
          title="base vesting resource"
          value={formatCurrency(10000000, CYBER.DENOM_CYBER)}
        />
        <CardStatisics title="base vesting time" value="1d:00h:00m" />
      </>
    );
  } catch (error) {
    console.log(error);
    return <div>oops...</div>;
  }
}

export default PowerTab;
