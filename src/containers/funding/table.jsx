import React, { useEffect, useState } from 'react';
import { Icon } from '@cybercongress/gravity';
import { formatNumber, trimString } from '../../utils/utils';
import { Tooltip, FormatNumber, RowTableTakeoff } from '../../components';

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
          <div className="table-rows-child" key={index}>
            <div className="numberType hash" />
            <div className="numberType display-none-mob">{item.timestamp}</div>
            <Tooltip
              placement="bottom"
              tooltip={`${formatNumber(item.price, 5)} ATOM`}
            >
              <div className="numberType">{formatNumber(item.price, 5)}</div>
            </Tooltip>
            <Tooltip
              placement="bottom"
              tooltip={`${formatNumber(item.amount)} ATOM`}
            >
              <div className="numberType">
                {item.amount > 1
                  ? formatNumber(Math.floor(item.amount))
                  : formatNumber(item.amount)}
              </div>
            </Tooltip>
            <Tooltip
              placement="bottom"
              tooltip={`${formatNumber(
                Math.floor(item.cybEstimation * 10 ** 9)
              )} CYBs`}
            >
              <div className="numberType">
                {item.cybEstimation < 1
                  ? formatNumber(Math.floor(item.cybEstimation * 1000) / 1000)
                  : formatNumber(Math.floor(item.cybEstimation))}
              </div>
            </Tooltip>
            <Tooltip
              placement="bottom"
              tooltip={`${formatNumber(Math.floor(item.estimationEUL))} EULs`}
            >
              <div
                style={{ fontSize: 14 }}
                className="numberType display-none-mob"
              >
                {item.estimationEUL < 1
                  ? formatNumber(Math.floor(item.estimationEUL * 1000) / 1000)
                  : formatNumber(Math.floor(item.estimationEUL))}
              </div>
            </Tooltip>
          </div>
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
          tooltip={`${formatNumber(
            Math.floor(dataTable[key].cyb * 10 ** 9)
          )} CYBs`}
        >
          <div className="numberType">
            {dataTable[key].cyb < 1
              ? formatNumber(Math.floor(dataTable[key].cyb * 1000) / 1000)
              : formatNumber(Math.floor(dataTable[key].cyb))}
          </div>
        </Tooltip>
        <Tooltip
          placement="bottom"
          tooltip={`${formatNumber(
            Math.floor(dataTable[key].eul * 10 ** 9)
          )} EULs`}
        >
          <div style={{ fontSize: 14 }} className="numberType display-none-mob">
            {dataTable[key].eul < 1
              ? formatNumber(Math.floor(dataTable[key].eul * 1000) / 1000)
              : formatNumber(Math.floor(dataTable[key].eul))}
          </div>
        </Tooltip>
      </RowTableTakeoff>
    ));
  }

  const tableRowPin = () =>
    Object.keys(dataTable)
      .filter((dataFilter) => dataTable[dataFilter].pin)
      .map((key, index) => (
        <RowTableTakeoff
          pin={key}
          key={key}
          statePin={dataTable[key].pin}
          item={dataTable[key].address.map((item, index) => (
            <div className="table-rows-child" key={index}>
              <div className="numberType hash" />
              <div className="numberType display-none-mob">
                {item.timestamp}
              </div>
              <Tooltip
                placement="bottom"
                tooltip={`${formatNumber(item.price, 5)} ATOM`}
              >
                <div className="numberType">{formatNumber(item.price, 5)}</div>
              </Tooltip>
              <Tooltip
                placement="bottom"
                tooltip={`${formatNumber(item.amount)} ATOM`}
              >
                <div className="numberType">
                  {item.amount > 1
                    ? formatNumber(Math.floor(item.amount))
                    : formatNumber(item.amount)}
                </div>
              </Tooltip>
              <Tooltip
                placement="bottom"
                tooltip={`${formatNumber(
                  Math.floor(item.cybEstimation * 10 ** 9)
                )} CYBs`}
              >
                <div className="numberType">
                  {item.cybEstimation < 1
                    ? formatNumber(Math.floor(item.cybEstimation * 1000) / 1000)
                    : formatNumber(Math.floor(item.cybEstimation))}
                </div>
              </Tooltip>
              <Tooltip
                placement="bottom"
                tooltip={`${formatNumber(Math.floor(item.estimationEUL))} EULs`}
              >
                <div
                  style={{ fontSize: 14 }}
                  className="numberType display-none-mob"
                >
                  {item.estimationEUL < 1
                    ? formatNumber(Math.floor(item.estimationEUL * 1000) / 1000)
                    : formatNumber(Math.floor(item.estimationEUL))}
                </div>
              </Tooltip>
            </div>
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
            tooltip={`${formatNumber(
              Math.floor(dataTable[key].cyb * 10 ** 9)
            )} CYBs`}
          >
            <div className="numberType">
              {dataTable[key].cyb < 1
                ? formatNumber(Math.floor(dataTable[key].cyb * 1000) / 1000)
                : formatNumber(Math.floor(dataTable[key].cyb))}
            </div>
          </Tooltip>
          <Tooltip
            placement="bottom"
            tooltip={`${formatNumber(
              Math.floor(dataTable[key].eul * 10 ** 9)
            )} EULs`}
          >
            <div
              style={{ fontSize: 14 }}
              className="numberType display-none-mob"
            >
              {dataTable[key].eul < 1
                ? formatNumber(Math.floor(dataTable[key].eul * 1000) / 1000)
                : formatNumber(Math.floor(dataTable[key].eul))}
            </div>
          </Tooltip>
        </RowTableTakeoff>
      ));

  return (
    <div style={styles} className="table">
      <div className="table-header-rows">
        <div className="numberType address">Address</div>
        <div className="numberType display-none-mob">Height</div>
        <div className="numberType">Price, ATOM</div>
        <div className="numberType">ATOM</div>
        <div className="numberType">GCYB</div>
        <div className="numberType display-none-mob">GEUL</div>
      </div>
      {pin && onlyPin && (
        <div
          className="table-body"
          style={{
            marginBottom: 10,
            paddingBottom: 10,
            borderBottom: onlyPin ? 'none' : '1px solid #fff',
          }}
        >
          {tableRowPin()}
        </div>
      )}
      {!onlyPin && <div className="table-body">{tableRow}</div>}
    </div>
  );
}

export default Table;
