import { useEffect, useState, useCallback } from 'react';
import { Display, DisplayTitle, Dots } from 'src/components';
import { formatCurrency, trimString } from 'src/utils/utils';
import { useBackend } from 'src/contexts/backend/backend';
import { ContainerKeyValue } from './utilsComponents';
import { useGetIpfsInfo } from '../ipfsSettings/ipfsComponents/infoIpfsNode';

function P2P() {
  const { idIpfs, loading } = useGetIpfsInfo();

  return (
    <Display title={<DisplayTitle title="drive" />}>
      {loading && <Dots />}
      {((!loading && idIpfs.multiaddrs) || []).map((multiaddr, index) => (
        <ContainerKeyValue key={`multiadr_${index}`}>
          <div>{multiaddr}</div>
        </ContainerKeyValue>
      ))}
    </Display>
  );
}

export default P2P;
