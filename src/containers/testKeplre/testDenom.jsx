import { useState, useEffect } from 'react';
import { useQueryClient } from 'src/contexts/queryClient';
import { reduceBalances } from '../../utils/utils';

import Denom from '../../components/denom';

function DenomTest() {
  const queryClient = useQueryClient();
  const [totalSupply, setTotalSupply] = useState(null);

  useEffect(() => {
    const feachData = async () => {
      if (queryClient) {
        const responseTotalSupply = await queryClient.totalSupply();
        const datareduceTotalSupply = reduceBalances(responseTotalSupply);
        setTotalSupply(datareduceTotalSupply);
      }
    };
    feachData();
  }, [queryClient]);

  console.log(`totalSupply`, totalSupply);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {totalSupply !== null &&
        Object.keys(totalSupply).map((key) => {
          return <Denom denomValue={key} key={key} />;
        })}
    </div>
  );
}

// eslint-disable-next-line import/no-unused-modules
export default DenomTest;
