import React, { useEffect, useState } from 'react';
import { Icon } from '@cybercongress/gravity';
import { formatNumber, trimString } from '../../utils/utils';
import { Tooltip, FormatNumber, RowTableTakeoff } from '../../components';

function Table({ data, fUpin, fPin, update, pin }) {
  const [dataTable, setDataTable] = useState({});

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

  const tableRow = Object.keys(dataTable).map((key, index) => (
    <RowTableTakeoff
      pin={key}
      unPin
      unPinFunc={fUpin}
      pinFunc={fPin}
      updateList={update}
      key={key}
      statePin={dataTable[key].pin}
      item={dataTable[key].address.map((item, index) => (
        <div className="table-rows-child" key={index}>
          <div className="numberType hash">
            <a
              href={`https://cosmos.bigdipper.live/transactions/${item.txhash}`}
              target="_blank"
            >
              {trimString(item.txhash, 10, 10)}
            </a>
          </div>
          <div className="numberType">{item.timestamp}</div>
          <div className="numberType">{formatNumber(item.price, 5)}</div>
          <Tooltip
            placement="bottom"
            tooltip={`${formatNumber(item.amount)} ATOMs`}
          >
            <div className="numberType">
              {item.amount > 1
                ? formatNumber(Math.floor(item.amount))
                : formatNumber(item.amount)}
            </div>
          </Tooltip>
          <Tooltip
            placement="bottom"
            tooltip={`${formatNumber(Math.floor(item.estimationEUL))} EULs`}
          >
            <div className="numberType">
              {item.estimationEUL / 10 ** 9 < 1
                ? formatNumber(
                    Math.floor((item.estimationEUL / 10 ** 9) * 1000) / 1000
                  )
                : formatNumber(Math.floor(item.estimationEUL / 10 ** 9))}
            </div>
          </Tooltip>
          <Tooltip
            placement="bottom"
            tooltip={`${formatNumber(Math.floor(item.cybEstimation))} CYBs`}
          >
            <div className="numberType">
              {item.cybEstimation / 10 ** 9 < 1
                ? formatNumber(
                    Math.floor((item.cybEstimation / 10 ** 9) * 1000) / 1000
                  )
                : formatNumber(Math.floor(item.cybEstimation / 10 ** 9))}
            </div>
          </Tooltip>
        </div>
      ))}
    >
      <div className="numberType address">{key}</div>
      <Tooltip
        placement="bottom"
        tooltip={`${formatNumber(dataTable[key].amountСolumn)} ATOMs`}
      >
        <div className="numberType">
          {dataTable[key].amountСolumn > 1
            ? formatNumber(Math.floor(dataTable[key].amountСolumn))
            : formatNumber(dataTable[key].amountСolumn)}
        </div>
      </Tooltip>
      <Tooltip
        placement="bottom"
        tooltip={`${formatNumber(Math.floor(dataTable[key].eul))} EULs`}
      >
        <div className="numberType">
          {dataTable[key].eul / 10 ** 9 < 1
            ? formatNumber(
                Math.floor((dataTable[key].eul / 10 ** 9) * 1000) / 1000
              )
            : formatNumber(Math.floor(dataTable[key].eul / 10 ** 9))}
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
    </RowTableTakeoff>
  ));

  const tableRowPin = () =>
    Object.keys(dataTable)
      .filter(dataFilter => dataTable[dataFilter].pin)
      .map((key, index) => (
        <RowTableTakeoff
          pin={key}
          unPin
          unPinFunc={fUpin}
          pinFunc={fPin}
          updateList={update}
          statePin={dataTable[key].pin}
          key={key}
          item={dataTable[key].address.map((item, index) => (
            <div className="table-rows-child" key={index}>
              <div className="numberType hash">
                <a
                  href={`https://cosmos.bigdipper.live/transactions/${item.txhash}`}
                  target="_blank"
                >
                  {trimString(item.txhash, 10, 10)}
                </a>
              </div>
              <div className="numberType">{item.timestamp}</div>
              <Tooltip
                placement="bottom"
                tooltip={`${formatNumber(Math.floor(item.amount))} EULs`}
              >
                <div className="numberType">{formatNumber(item.amount)}</div>
              </Tooltip>
              <Tooltip
                placement="bottom"
                tooltip={`${formatNumber(Math.floor(item.cybEstimation))} EULs`}
              >
                <div className="numberType">
                  {formatNumber(Math.floor(item.cybEstimation / 10 ** 9))}
                </div>
              </Tooltip>
              <Tooltip
                placement="bottom"
                tooltip={`${formatNumber(Math.floor(item.cybEstimation))} CYBs`}
              >
                <div className="numberType">
                  {formatNumber(Math.floor(item.cybEstimation / 10 ** 9))}
                </div>
              </Tooltip>
            </div>
          ))}
        >
          <div className="numberType address">{key}</div>
          <Tooltip
            placement="bottom"
            tooltip={`${formatNumber(dataTable[key].amountСolumn)} ATOMs`}
          >
            <div className="numberType">
              {formatNumber(dataTable[key].amountСolumn)}
            </div>
          </Tooltip>
          <Tooltip
            placement="bottom"
            tooltip={`${formatNumber(Math.floor(dataTable[key].eul))} EULs`}
          >
            <div className="numberType">
              {formatNumber(Math.floor(dataTable[key].eul / 10 ** 9))}
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
        </RowTableTakeoff>
      ));

  return (
    <div>
      <div className="table">
        <div className="table-header-rows">
          <div className="numberType address">Address (TX id)</div>
          <div className="numberType sort-row">
            Height
            {/* <Icon
                icon="double-caret-vertical"
                color="#3ab793d4"
                marginLeft={5}
              /> */}
          </div>
          <div className="numberType sort-row">
            Price, ATOMs
            {/* <Icon
                icon="double-caret-vertical"
                color="#3ab793d4"
                marginLeft={5}
              /> */}
          </div>
          <div className="numberType sort-row">
            ATOMs
            {/* <Icon
                icon="double-caret-vertical"
                color="#3ab793d4"
                marginLeft={5}
              /> */}
          </div>
          <div className="numberType sort-row">
            GEUL
            {/* <Icon
                icon="double-caret-vertical"
                color="#3ab793d4"
                marginLeft={5}
              /> */}
          </div>
          <div className="numberType sort-row">
            GCYB
            {/* <Icon
                icon="double-caret-vertical"
                color="#3ab793d4"
                marginLeft={5}
              /> */}
          </div>
        </div>
        {pin && (
          <div
            className="table-body"
            style={{
              marginBottom: 10,
              paddingBottom: 10,
              borderBottom: '1px solid #fff',
            }}
          >
            {tableRowPin()}
          </div>
        )}
        <div className="table-body">{tableRow}</div>
      </div>
    </div>
  );
}

export default Table;
