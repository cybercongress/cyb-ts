import { useEffect, useState } from 'react';
import { Dots } from '../../../../components';
import { formatCurrency, trimString } from '../../../../utils/utils';
import { ContainerKeyValue } from './utilsComponents';
import { useIpfs } from 'src/contexts/ipfs';

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

export function useGetIpfsInfo() {
  const { node: ipfs } = useIpfs();
  const [repoSizeValue, setRepoSizeValue] = useState<number | string>(0);
  const [idIpfs, setIdIpfs] = useState({ id: '', agentVersion: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getIpfsStat = async () => {
      setLoading(true);
      if (ipfs !== null) {
        const { id, agentVersion, repoSize } = await ipfs.info();
        setIdIpfs({ id, agentVersion });
        const repoSizeString =
          repoSize > -1
            ? formatCurrency(Number(repoSize), 'B', 2, PREFIXES)
            : 'n/a';
        setRepoSizeValue(repoSizeString);
      }
      setLoading(false);
    };
    getIpfsStat();
  }, [ipfs]);

  return { idIpfs, repoSizeValue, loading };
}

function InfoIpfsNode() {
  const { idIpfs, repoSizeValue, loading } = useGetIpfsInfo();

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
