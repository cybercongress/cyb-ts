import React, { useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { LinkCreator } from '../ui/ui';
import { trimString } from '../../../utils/utils';

const ContractTable = ({ contracts }) => {
  const [itemsToShow, setItemsToShow] = useState(40);

  const setNextDisplayedPalettes = useCallback(() => {
    setTimeout(() => {
      setItemsToShow(itemsToShow + 5);
    }, 250);
  }, [itemsToShow, setItemsToShow]);

  const displayedPalettes = useMemo(() => contracts.slice(0, itemsToShow), [
    itemsToShow,
    contracts,
  ]);

  const itemTable = displayedPalettes.map((item) => {
    const { address, fees, gas, label, creator, tx } = item;
    return (
      <tr style={{ textAlign: 'center' }} key={address}>
        <td>
          <div
            className="name-column"
            style={{ textAlign: 'start' }}
            title={label}
          >
            {label}
          </div>
        </td>
        <td>
          <Link to={`/contracts/${address}`}>{trimString(address, 10, 8)}</Link>
        </td>
        <td>
          <LinkCreator address={creator}>
            {trimString(creator, 10, 8)}
          </LinkCreator>
        </td>
        <td>{tx}</td>
        <td>{gas}</td>
        <td>{fees}</td>
      </tr>
    );
  });

  return (
    <table
      style={{
        borderSpacing: '5px 16px',
        borderCollapse: 'separate',
      }}
      className="table"
    >
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Address</th>
          <th scope="col">Owner</th>
          <th scope="col">Txs</th>
          <th scope="col">Gas</th>
          <th scope="col">Fees</th>
        </tr>
      </thead>
      <tbody>{itemTable}</tbody>
    </table>
  );
};

export default ContractTable;
