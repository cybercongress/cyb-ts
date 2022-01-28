import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Account } from '../../../../components';
import { AppContext } from '../../../../context';
import { trimString } from '../../../../utils/utils';

const tags = (address) => [
  {
    key: 'execute._contract_address',
    value: address,
  },
  {
    key: 'message.action',
    value: '/cosmwasm.wasm.v1.MsgExecuteContract',
  },
];

const styleLable = {
  textAlign: 'start',
  maxWidth: '200px',
  textOverflow: 'ellipsis',
  overflowX: 'hidden',
  whiteSpace: 'nowrap',
};

function InstanceRow({ position, address }) {
  const { jsCyber } = useContext(AppContext);
  const [executionCount, setExecutionCount] = useState(0);
  const [contract, setContractInfo] = useState({});

  useEffect(() => {
    const getContract = async () => {
      if (jsCyber !== null) {
        const response = await jsCyber.getContract(address);
        // console.log(`response`, response);
        setContractInfo(response);
      }
    };
    getContract();
  }, [jsCyber, address]);

  useEffect(() => {
    const searchTx = async () => {
      if (jsCyber !== null) {
        const response = await jsCyber.searchTx({
          tags: tags(address),
        });

        if (response.length > 0) {
          setExecutionCount(response.length);
        }
      }
    };
    searchTx();
  }, [jsCyber, address]);

  return (
    <>
      {Object.keys(contract).length > 0 && (
        <tr style={{ textAlign: 'center' }}>
          <th scope="row">{position}</th>
          <td>
            <div style={styleLable}>{contract.label}</div>
          </td>
          <td>
            <Link to={`/contracts/${contract.address}`}>
              {trimString(contract.address, 10, 6)}
            </Link>
          </td>
          <td>
            <Account address={contract.creator} />
          </td>
          <td>{contract.admin ? contract.admin : '-'}</td>
          <td style={{ textAlign: 'end' }}>{executionCount}</td>
        </tr>
      )}
    </>
  );
}

export default InstanceRow;
