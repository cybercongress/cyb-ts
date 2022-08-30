import { useEffect, useState, useContext} from 'react';
import { AppContext } from '../../../context';
import { CYBER, DEFAULT_GAS_LIMITS, WARP_CONTRACTS } from '../../../utils/config';
import { getCoinDecimals } from "../utils";




export function getNetworks() {
  const { jsCyber } = useContext(AppContext);
  const [allNetworks, setAllNetworks] = useState({ networks: null  });

  useEffect(() => {
    const getAllNetworks = async () => {
      if (jsCyber !== null) {
        const result = await jsCyber.queryContractSmart
        (
            WARP_CONTRACTS.NETWORKS,
          {
              "get_tokens": {}
            }
        );
        let objectMappedResult={};
        result.entries.forEach((row)=>{
          objectMappedResult[row.chain_id]=row;
        })
        console.log('Contract Networks ',objectMappedResult);
        setAllNetworks({networks: objectMappedResult});
      }
    };
    getAllNetworks();
  }, [jsCyber]);
  return allNetworks;
}



export function getTokens() {
  const { jsCyber } = useContext(AppContext);
  const [allTokens, setAllTokens] = useState({ tokens: null });


  useEffect(() => {
    const getAllTokens = async () => {
      if (jsCyber !== null) {
        const result = await jsCyber.queryContractSmart
        (
            WARP_CONTRACTS.TOKENS,
            {
              "get_tokens": {}
            }
        );
        let objectMappedResult= { };
        result.entries.forEach((row)=>{
          objectMappedResult[row.ticker]=row;
        })
        console.log('Contract tokens result data',objectMappedResult);


        setAllTokens({ tokens: objectMappedResult });
      }
    };
    getAllTokens();
  }, [jsCyber]);

  return allTokens;
}
export default getNetworks;

