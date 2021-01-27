import React, { useEffect, useState } from 'react';
import { Icon } from '@cybercongress/gravity';
import { formatNumber, trimString } from '../../utils/utils';
import { Tooltip, FormatNumber, RowTableTakeoff } from '../../components';

const ItemSubGroup = ({ item, index }) => {
  return (
    <div className="table-rows-child" key={index}>
      <div className="numberType hash">
        <a href={`https://etherscan.io/tx/${item.ethTxhash}`} target="_blank">
          {trimString(item.ethTxhash, 8, 8)}
        </a>
      </div>
      <div className="numberType display-none-mob">{item.block}</div>
      <Tooltip
        placement="bottom"
        tooltip={`${formatNumber(0, 10)} ATOM`} // item.price
      >
        <div className="numberType">{formatNumber(0, 5)}</div>
      </Tooltip>
      <Tooltip
        placement="bottom"
        tooltip={`${formatNumber(item.amountEth)} ATOM`}
      >
        <div className="numberType">
          {item.amountEth > 1
            ? formatNumber(Math.floor(item.amountEth))
            : formatNumber(item.amountEth)}
        </div>
      </Tooltip>
      <Tooltip
        placement="bottom"
        tooltip={`${formatNumber(Math.floor(item.eul))} CYBs`}
      >
        <div className="numberType">
          {item.eul / 10 ** 9 < 1
            ? formatNumber(Math.floor((item.eul / 10 ** 9) * 1000) / 1000)
            : formatNumber(Math.floor(item.eul / 10 ** 9))}
        </div>
      </Tooltip>
      <Tooltip
        placement="bottom"
        tooltip={`${formatNumber(Math.floor(item.eul))} EULs`}
      >
        <div style={{ fontSize: 14 }} className="numberType display-none-mob">
          {item.eul / 10 ** 9 < 1
            ? formatNumber(Math.floor((item.eul / 10 ** 9) * 1000) / 1000)
            : formatNumber(Math.floor(item.eul / 10 ** 9))}
        </div>
      </Tooltip>
    </div>
  );
};

function Table({ data, onlyPin, pin, mobile, styles }) {
  const [dataTable, setDataTable] = useState({});
  let tableRow;

  useEffect(() => {
    if (Object.keys(data).length > 0) {
      const keysSorted = Object.keys(data)
        .sort((a, b) => data[b].amountСolumn - data[a].amountСolumn)
        .reduce(
          (_sortedObj, key) => ({
            ..._sortedObj,
            [key]: data[key],
          }),
          {}
        );
      setDataTable(keysSorted);
    }
  }, [data]);

  if (!onlyPin) {
    tableRow = Object.keys(dataTable).map((key, index) => (
      <RowTableTakeoff
        pinAddress={dataTable[key].pin}
        key={key}
        item={dataTable[key].address.map((item, index) => (
          <ItemSubGroup item={item} index={index} />
        ))}
      >
        <div className="numberType address">
          {mobile ? trimString(key, 10, 8) : key}
        </div>
        <Tooltip
          placement="bottom"
          tooltip={`${formatNumber(dataTable[key].amountСolumn)} ATOM`}
        >
          <div className="numberType">
            {dataTable[key].amountСolumn > 1
              ? formatNumber(Math.floor(dataTable[key].amountСolumn))
              : formatNumber(dataTable[key].amountСolumn)}
          </div>
        </Tooltip>
        <Tooltip
          placement="bottom"
          tooltip={`${formatNumber(Math.floor(dataTable[key].cyb))} CYBs`}
        >
          <div className="numberType">
            {dataTable[key].cyb / 10 ** 9 < 1
              ? formatNumber(
                  Math.floor((dataTable[key].cyb / 10 ** 9) * 1000) / 1000
                )
              : formatNumber(Math.floor(dataTable[key].cyb / 10 ** 9))}
          </div>
        </Tooltip>
        <Tooltip
          placement="bottom"
          tooltip={`${formatNumber(Math.floor(dataTable[key].eul))} EULs`}
        >
          <div style={{ fontSize: 14 }} className="numberType display-none-mob">
            {dataTable[key].eul / 10 ** 9 < 1
              ? formatNumber(
                  Math.floor((dataTable[key].eul / 10 ** 9) * 1000) / 1000
                )
              : formatNumber(Math.floor(dataTable[key].eul / 10 ** 9))}
          </div>
        </Tooltip>
      </RowTableTakeoff>
    ));
  }

  return (
    <div style={styles} className="table">
      <div className="table-header-rows">
        <div className="numberType address">Address (TX id)</div>
        <div className="numberType display-none-mob">Height</div>
        <div className="numberType">Price, ATOM</div>
        <div className="numberType">ETH</div>
        <div className="numberType">GCYB</div>
        <div className="numberType display-none-mob">GEUL</div>
      </div>
      {!onlyPin && <div className="table-body">{tableRow}</div>}
    </div>
  );
}

export default Table;
