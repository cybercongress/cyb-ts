import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context';
import { reduceBalances } from '../../utils/utils';

import Denom from '../../components/denom';

function DenomTest() {
  const { jsCyber } = useContext(AppContext);
  const [totalSupply, setTotalSupply] = useState(null);

  useEffect(() => {
    const feachData = async () => {
      if (jsCyber !== null) {
        const responseTotalSupply = await jsCyber.totalSupply();
        const datareduceTotalSupply = reduceBalances(responseTotalSupply);
        setTotalSupply(datareduceTotalSupply);
      }
    };
    feachData();
  }, [jsCyber]);

  console.log(`totalSupply`, totalSupply);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {totalSupply !== null &&
        Object.keys(totalSupply).map((key) => {
          return (
            <>
              <Denom denomValue={key} />
            </>
          );
        })}
    </div>
  );
}

export default DenomTest;
