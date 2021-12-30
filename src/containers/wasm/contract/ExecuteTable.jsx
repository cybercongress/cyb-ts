import React, { useState, useCallback, useMemo } from 'react';
import { AppContext } from '../../../context';
import { LinkTx, LinkCreator } from '../ui/ui';
import {
  formatNumber,
  trimString,
  parseMsgContract,
} from '../../../utils/utils';

function ExecuteTable({ executions }) {
  const [itemsToShow, setItemsToShow] = useState(40);
  console.log(`executions`, executions);

  const setNextDisplayedPalettes = useCallback(() => {
    setTimeout(() => {
      setItemsToShow(itemsToShow + 5);
    }, 250);
  }, [itemsToShow, setItemsToShow]);

  const displayedPalettes = useMemo(() => executions.slice(0, itemsToShow), [
    itemsToShow,
    executions,
  ]);

  const itemTable = displayedPalettes.map((item) => {
    return (
      <tr style={{ textAlign: 'center' }} key={item.key}>
        <td>{formatNumber(item.height)}</td>
        <td>
          <LinkTx txs={item.transactionId}>
            {trimString(item.transactionId, 8, 8)}
          </LinkTx>
        </td>
        <td>{Object.keys(parseMsgContract(item.msg.msg))[0]}</td>
        <td>
          <LinkCreator address={item.msg.sender}>
            {trimString(item.msg.sender, 10)}
          </LinkCreator>
        </td>
      </tr>
    );
  });

  return (
    <table style={{ width: '100%' }}>
      <thead>
        <tr>
          <th scope="col">Height</th>
          <th scope="col">Txs</th>
          <th scope="col">Action</th>
          <th scope="col">Sender</th>
        </tr>
      </thead>
      <tbody>{itemTable}</tbody>
    </table>
  );
}

export default ExecuteTable;
