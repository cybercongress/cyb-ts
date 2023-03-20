import React, { useEffect, useState } from 'react';
import { Dots } from '../../../components';
import { formatCurrency, trimString } from '../../../utils/utils';
import { ContainerKeyValue } from './utilsComponents';

const PREFIXES = [
  {
    prefix: 'T',
    power: 1024 * 10 ** 9,
  },
  {
    prefix: 'G',
    power: 1024 * 10 ** 6,
  },
  {
    prefix: 'M',
    power: 1024 * 10 ** 3,
  },
  {
    prefix: 'K',
    power: 1024,
  },
];

function useGetIpfsInfo(ipfs) {
  const [repoSizeValue, setRepoSizeValue] = useState(0);
  const [idIpfs, setIdIpfs] = useState({ id: '', agentVersion: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getIpfsStat = async () => {
      setLoading(true);
      if (ipfs !== null) {
        const response = await ipfs.stats.repo();
        const repoSize = formatCurrency(
          Number(response.repoSize),
          'B',
          2,
          PREFIXES
        );
        setRepoSizeValue(repoSize);

        const responseId = await ipfs.id();
        const { agentVersion, id } = responseId;
        const idString = id.toString();
        setIdIpfs({
          id: idString,
          agentVersion: agentVersion.replace(/\//g, ' '),
        });
      }
      setLoading(false);
    };
    getIpfsStat();
  }, [ipfs]);

  return { idIpfs, repoSizeValue, loading };
}

function InfoIpfsNode({ ipfs }) {
  const { idIpfs, repoSizeValue, loading } = useGetIpfsInfo(ipfs);

  return (
    <>
      <ContainerKeyValue>
        <div>id</div>
        {loading ? (
          <Dots />
        ) : (
          <div>{idIpfs.id.length > 0 ? trimString(idIpfs.id, 8, 8) : ''}</div>
        )}
      </ContainerKeyValue>
      <ContainerKeyValue>
        <div>agent version</div>
        {loading ? <Dots /> : <div>{idIpfs.agentVersion}</div>}
      </ContainerKeyValue>
      <ContainerKeyValue>
        <div>repo size</div>
        {loading ? <Dots /> : <div>{repoSizeValue}</div>}
      </ContainerKeyValue>
    </>
  );
}

export default InfoIpfsNode;
