import React from 'react';
import { SubnetInfo } from 'src/features/cybernet/types';
import useCybernetContract from 'src/features/cybernet/useContract';

function NProvider({ address }) {
  console.log(address);

  const { data, loading, error } = useCybernetContract<any>({
    query: {
      get_hotkey_owner: {
        hotkey: address,
      },
    },
  });

  console.log(data, loading, error);

  return <div></div>;
}

export default NProvider;
