import React, { useEffect, useState } from 'react';
import { formatNumber, trimString } from '../../utils/utils';
import { Tooltip, FormatNumber, RowTableTakeoff } from '../../components';
import { CYBER } from '../../utils/config';

const DEFAULT_PROOF = 'Processing';

const tableNumber = (number) => {
  return number / 10 ** 9 < 1
    ? formatNumber(Math.floor((number / 10 ** 9) * 1000) / 1000)
    : formatNumber(Math.floor(number / 10 ** 9));
};

const ItemSubGroup = ({ item, index }) => {
  return (
    <div
      className="table-rows-child"
      style={{ gridTemplateColumns: '1.4fr 0.5fr 0.5fr 0.5fr' }}
      key={index}
    >
      <div
        className="numberType hash"
        style={{ paddingLeft: 20, textAlign: 'start' }}
      >
        <a href={`https://etherscan.io/tx/${item.ethTxhash}`} target="_blank">
          {trimString(item.ethTxhash, 8, 8)}
        </a>
      </div>
      {/* <div className="numberType display-none-mob">{item.block}</div> */}
      {/* <div className="numberType">
        {item.cyberHash === null ? (
          DEFAULT_PROOF.toUpperCase()
        ) : (
          <Link to={`/network/euler/tx/${item.cyberHash.toUpperCase()}`}>
            {trimString(item.cyberHash.toUpperCase(), 5, 5)}
          </Link>
        )}
      </div> */}
      <Tooltip
        placement="bottom"
        tooltip={`${formatNumber(item.avPrice, 6)} ETH`} // item.price
      >
        <div className="numberType">
          {item.avPrice !== null
            ? formatNumber(item.avPrice, 6)
            : DEFAULT_PROOF.toUpperCase()}
        </div>
      </Tooltip>
      <Tooltip
        placement="bottom"
        tooltip={`${formatNumber(item.amountEth)} ETH`}
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
          {item.eul !== null
            ? tableNumber(item.eul)
            : DEFAULT_PROOF.toUpperCase()}
        </div>
      </Tooltip>
    </div>
  );
};

const RowTable = ({ pin, address, item, mobile }) => {
  return (
    <RowTableTakeoff
      style={{ gridTemplateColumns: '1.9fr 0.5fr 0.5fr' }}
      pinAddress={pin !== null ? address === pin.bech32 : false}
      key={address}
      item={item.address.map((items, index) => (
        <ItemSubGroup item={items} index={index} />
      ))}
    >
      <div className="numberType address">
        {mobile ? trimString(address, 10, 8) : address}
      </div>
      <Tooltip
        placement="bottom"
        tooltip={`${formatNumber(item.amountСolumn)} ETH`}
      >
        <div className="numberType">
          {item.amountСolumn > 1
            ? formatNumber(Math.floor(item.amountСolumn))
            : formatNumber(item.amountСolumn)}
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
    </RowTableTakeoff>
  );
};

function Table({ data, onlyPin, pin, mobile, styles }) {
  const [dataTable, setDataTable] = useState({});
  let tableRow;
  let tableRowPin;

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
      <RowTable
        pin={pin}
        address={key}
        mobile={mobile}
        key={key}
        item={dataTable[key]}
      />
    ));
  }

  if (pin !== null) {
    tableRowPin = Object.keys(dataTable)
      .filter((dataFilter) => dataFilter === pin.bech32)
      .map((key, index) => (
        <RowTable
          pin={pin}
          address={key}
          mobile={mobile}
          key={key}
          item={dataTable[key]}
        />
      ));
  }

  return (
    <div style={styles} className="table">
      <div
        style={{ gridTemplateColumns: '1.4fr 1.4fr 1fr 1fr' }}
        className="table-header-rows"
      >
        <div className="numberType address">Address (TX id)</div>
        {/* <div className="numberType display-none-mob">Height</div> */}
        {/* <div className="numberType">Proof TX</div> */}
        <div className="numberType">Price, ETH</div>
        <div className="numberType">ETH</div>
        <div className="numberType">GCYB</div>
      </div>
      {pin !== null && onlyPin && (
        <div
          className="table-body"
          style={{
            marginBottom: 10,
            paddingBottom: 10,
            borderBottom: onlyPin ? 'none' : '1px solid #fff',
          }}
        >
          {tableRowPin}
        </div>
      )}
      {!onlyPin && <div className="table-body">{tableRow}</div>}
    </div>
  );
}

export default Table;
