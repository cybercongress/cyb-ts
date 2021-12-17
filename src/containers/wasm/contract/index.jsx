import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AppContext } from '../../../context';
import { makeTags } from '../../../utils/utils';
import HistoryInfo from './HistoryInfo';
import InitializationInfo from './InitializationInfo';
import QueryContract from './QueryContract';

const Separator = () => (
  <>
    <br />
    <hr />
    <br />
  </>
);

const getAndSetDetails = async (client, contractAddress, setDetails) => {
  try {
    const response = await client.getContract(contractAddress);
    console.log(`response getAndSetDetails`, response);
    setDetails(response);
  } catch (error) {
    console.log(`error`, error);
  }
};

const getAndSetContractCodeHistory = async (
  client,
  contractAddress,
  setContractCodeHistory
) => {
  try {
    const response = await client.getContractCodeHistory(contractAddress);
    console.log(`response getContractCodeHistory`, response);
    setContractCodeHistory(response);
  } catch (error) {
    console.log(`error`, error);
  }
};

const getAndSetInstantiationTxHash = async (
  client,
  contractAddress,
  setInstantiationTxHash
) => {
  try {
    const response = await client.searchTx({
      tags: makeTags(
        `message.module=wasm&message.action=/cosmwasm.wasm.v1.MsgInstantiateContract&instantiate._contract_address=${contractAddress}`
      ),
    });
    const first = response.find(() => true);
    if (first.hash) {
      console.log(`first.hash`, first.hash);
      setInstantiationTxHash(first.hash);
    }
  } catch (error) {
    console.log(`error`, error);
  }
};

const useGetInfoContractAddress = (contractAddress) => {
  const { jsCyber } = useContext(AppContext);
  const [instantiationTxHash, setInstantiationTxHash] = useState('');
  const [contractCodeHistory, setContractCodeHistory] = useState([]);
  const [executions, setExecutions] = useState([]);
  const [details, setDetails] = useState({});
  const [balance, setBalance] = useState({ denom: '', amount: 0 });

  useEffect(() => {
    if (jsCyber !== null) {
      getAndSetDetails(jsCyber, contractAddress, setDetails);
      getAndSetContractCodeHistory(
        jsCyber,
        contractAddress,
        setContractCodeHistory
      );
      getAndSetInstantiationTxHash(
        jsCyber,
        contractAddress,
        setInstantiationTxHash
      );
    }
  }, [jsCyber, contractAddress]);

  return {
    balance,
    details,
    executions,
    contractCodeHistory,
    instantiationTxHash,
  };
};

function ContractPage() {
  const { contractAddress } = useParams();
  const {
    balance,
    details,
    instantiationTxHash,
    contractCodeHistory,
  } = useGetInfoContractAddress(contractAddress);

  return (
    <main className="block-body">
      <div>Contract {contractAddress}</div>
      <div>
        Balance: {balance.amount} {balance.denom}
      </div>
      <Separator />
      <InitializationInfo initTxHash={instantiationTxHash} details={details} />
      <Separator />
      <HistoryInfo contractCodeHistory={contractCodeHistory} />
      <Separator />
      <QueryContract contractAddress={contractAddress} />
    </main>
  );
}

export default ContractPage;
