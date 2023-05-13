/* eslint-disable no-restricted-syntax */
import { useEffect, useState } from 'react';
import { Sha256 } from '@cosmjs/crypto';
import { useIbcDenom } from 'src/contexts/ibcDenom';
import { CYBER } from '../../../utils/config';
import networkList from '../../../utils/networkListIbc';

const sha256 = (data) => {
  return new Uint8Array(new Sha256().update(data).digest());
};

const ibcDenom = (paths, coinMinimalDenom) => {
  const prefixes = [];
  for (const path of paths) {
    prefixes.push(`${path.portId}/${path.channelId}`);
  }
  const prefix = prefixes.join('/');
  const denom = `${prefix}/${coinMinimalDenom}`;

  return `ibc/${Buffer.from(sha256(Buffer.from(denom)))
    .toString('hex')
    .toUpperCase()}`;
};

function useGetBalancesIbc(client, denom) {
  const { ibcDenoms: ibcDataDenom } = useIbcDenom();
  const [balanceIbc, setBalanceIbc] = useState(null);
  const [denomIbc, setDenomIbc] = useState(null);

  useEffect(() => {
    const getBalance = async () => {
      if (client && denom !== null) {
        const responseChainId = client.signer.chainId;
        if (responseChainId !== CYBER.CHAIN_ID) {
          let coinMinimalDenom = null;
          if (denom.includes('ibc') && ibcDataDenom) {
            coinMinimalDenom = ibcDataDenom[denom].baseDenom;
          } else {
            coinMinimalDenom = ibcDenom(
              [
                {
                  portId: 'transfer',
                  channelId: networkList[responseChainId].sourceChannelId,
                },
              ],
              denom
            );
          }
          const [{ address }] = await client.signer.getAccounts();
          const responseBalance = await client.queryClient.bank.balance(
            address,
            coinMinimalDenom
          );
          setDenomIbc(coinMinimalDenom);
          console.log('response', responseBalance);
          setBalanceIbc({ [coinMinimalDenom]: responseBalance.amount });
        }
      }
    };
    getBalance();
  }, [client, denom, ibcDataDenom]);

  return { balanceIbc, denomIbc };
}

export default useGetBalancesIbc;
