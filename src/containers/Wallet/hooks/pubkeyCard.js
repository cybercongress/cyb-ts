import { useEffect, useState } from 'react';
import Web3Utils from 'web3-utils';
import { getBalance, getTotalEUL } from '../../../utils/search/utils';
import { COSMOS, AUCTION, NETWORKSIDS } from '../../../utils/config';
import { useGetBalance } from '../../account/hooks';
import waitForWeb3 from '../../../components/web3/waitForWeb3';
import abiToken from '../../../../contracts/Token';

export const useAddressInfo = (accounts, updateCard) => {
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [totalCyber, setTotalCyber] = useState(0);
  const [totalCosmos, setTotalCosmos] = useState(0);
  const [address, setAddress] = useState(null);
  const { balance, balanceToken } = useGetBalance(address, updateCard);

  useEffect(() => {
    setTotalCyber(balance);
  }, [balance]);

  useEffect(() => {
    const feachData = async () => {
      setLoadingInfo(true);
      if (accounts.cyber) {
        setAddress(accounts.cyber.bech32);
      }
      if (accounts.cosmos) {
        const responseCosmos = await getBalance(
          accounts.cosmos.bech32,
          COSMOS.GAIA_NODE_URL_LSD
        );
        const responseTotalCosmos = await getTotalEUL(responseCosmos);
        setTotalCosmos(responseTotalCosmos);
      }
      setLoadingInfo(false);
    };
    feachData();
  }, [accounts, updateCard]);

  return {
    totalCyber,
    totalCosmos,
    loadingInfo,
    balanceToken,
  };
};

export const useGetBalanceEth = (address) => {
  const [balanceEth, setBalanceEth] = useState({
    eth: 0,
    gol: 0,
  });

  useEffect(() => {
    const feachData = async () => {
      const web3 = await waitForWeb3();
      const networkId = await web3.eth.net.getId();
      const networkContract = NETWORKSIDS.main;
      if (networkContract !== networkId) {
        return;
      }
      const { givenProvider } = web3;
      if (givenProvider && givenProvider !== null) {
        const responseEth = await web3.eth.getBalance(address.bech32);
        const eth = Web3Utils.fromWei(responseEth, 'ether');
        setBalanceEth((item) => ({ ...item, eth }));
        const contractToken = await new web3.eth.Contract(
          abiToken,
          AUCTION.ADDR_TOKEN
        );
        const responseGol = await contractToken.methods
          .balanceOf(address.bech32)
          .call();
        console.log(`responseGol`, responseGol);
        setBalanceEth((item) => ({ ...item, gol: responseGol }));
      }
    };
    setTimeout(feachData, 100);
  }, [address]);

  return balanceEth;
};
