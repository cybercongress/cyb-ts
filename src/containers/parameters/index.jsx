import React, { useEffect } from 'react';
import { getParamNetwork } from '../../utils/search/utils';

function ParamNetwork() {
  useEffect(() => {
    const feachData = async () => {
      const response = await getParamNetwork();
      console.log('response Param', response);
    };
    feachData();
  }, []);

  return (
    <main className="block-body">
      <div>Param</div>
    </main>
  );
}

export default ParamNetwork;
