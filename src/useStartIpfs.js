import { useEffect, useState } from 'react';
import { destroyIpfsClient, initIpfsClient } from './utils/ipfs/init';

let ipfs = null;

const getOpts = () => {
  let ipfsOpts = {
    ipfsNodeType: 'embedded', // external || embedded
    urlOpts: '/ip4/127.0.0.1/tcp/5001', // default url
    userGateway: 'http://127.0.0.1:8080',
  };

  // get type ipfs
  const lsTypeIpfs = localStorage.getItem('ipfsState');
  if (lsTypeIpfs !== null) {
    const lsTypeIpfsData = JSON.parse(lsTypeIpfs);
    ipfsOpts = { ...ipfsOpts, ...lsTypeIpfsData };
  }

  localStorage.setItem('ipfsState', JSON.stringify(ipfsOpts));

  return { ipfsOpts };
};

function useStartIpfs() {
  const [isIpfsReady, setIpfsReady] = useState(Boolean(ipfs));
  const [ipfsInitError, setIpfsInitError] = useState(null);
  const [isIpfsPending, setIsIpfsPending] = useState(false);

  const startConnectionIpfs = async () => {
    if (isIpfsPending === false) {
      setIsIpfsPending(true);
      setIpfsInitError(null);

      const { ipfsOpts } = getOpts();

      try {
        ipfs = await initIpfsClient(ipfsOpts);
      } catch (err) {
        setIpfsInitError(err.message || err);
      }
      setIpfsReady(Boolean(ipfs));
      setIsIpfsPending(false);
    }
  };

  useEffect(() => {
    startConnectionIpfs();

    return async () => {
      await destroyIpfsClient();
      setIpfsReady(false);
      ipfs = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handlerEventListener = () => {
      startConnectionIpfs();
    };

    document.addEventListener('reconnectIpfsClient', handlerEventListener);
    return () => {
      document.removeEventListener('reconnectIpfsClient', handlerEventListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ipfs, isIpfsReady, ipfsInitError, isIpfsPending };
}

export default useStartIpfs;
