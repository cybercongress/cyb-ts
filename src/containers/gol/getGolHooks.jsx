import { useEffect, useState } from 'react';
import finalResultGoL from '../../utils/finalResultGoL';
import { fromBech32 } from '../../utils/utils';

const initValueState = {
  cybercongress: 0,
  cybersenate: 0,
  gift: 0,
  'gol.comm_pool': 0,
  'gol.delegation': 0,
  'gol.lifetime': 0,
  'gol.load': 0,
  'gol.posthuman': 0,
  'gol.relevance': 0,
  'gol.sergeandmyself': 0,
  'grants.cyberdbot': 0,
  'grants.init_implementation': 0,
  greatweb_foundation: 0,
  'heroes.euler4': 0,
  'heroes.pre_bostrom': 0,
  inventors: 0,
  'investors.genesis': 0,
  'investors.port': 0,
  'investors.takeoff': 0,
  sum: 0,
};

function useGetGol(address) {
  const [resultGol, setResultGol] = useState({});
  const [totalGol, setTotalGol] = useState(0);

  useEffect(() => {
    if (address && address !== 0) {
      if (Object.prototype.hasOwnProperty.call(finalResultGoL, address)) {
        const resultGolData = finalResultGoL[address];
        setResultGol((item) => ({ ...item, ...resultGolData }));
        if (resultGolData.sum) {
          setTotalGol(resultGolData.sum);
        }
      } else {
        setTotalGol(0);
        setResultGol({});
      }
    }
  }, [address]);

  return { totalGol, resultGol };
}

export default useGetGol;
