import { useEffect, useState, useRef } from 'react';
import { destroyIpfsClient, initIpfsClient } from './utils/ipfs/init';

let ipfs = null;

const getOpts = () => {
  let ipfsOpts = {
    ipfsNodeType: 'external', // external || embedded
    urlOpts: '/ip4/127.0.0.1/tcp/5001', // default url
  };

  // get type ipfs
  const lsTypeIpfs = localStorage.getItem('ipfsState');
  if (lsTypeIpfs !== null) {
    const lsTypeIpfsData = JSON.parse(lsTypeIpfs);
    ipfsOpts = { ...ipfsOpts, ...lsTypeIpfsData };
  } else {
    localStorage.setItem('ipfsState', JSON.stringify(ipfsOpts));
  }

  return { ipfsOpts };
};

function useNewIpfs() {
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
        console.log('ipfs', ipfs);
      } catch (err) {
        console.log('initIpfsClient', err);
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
  }, []);

  useEffect(() => {
    const handlerEventListener = () => {
      startConnectionIpfs();
    };

    document.addEventListener('reconnectIpfsClient', handlerEventListener);
    return () => {
      document.removeEventListener('reconnectIpfsClient', handlerEventListener);
    };
  }, []);

  return { ipfs, isIpfsReady, ipfsInitError, isIpfsPending };
}

export default useNewIpfs;
