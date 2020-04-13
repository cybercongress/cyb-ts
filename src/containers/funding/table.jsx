import React, { useEffect, useState } from 'react';
import { Icon } from '@cybercongress/gravity';
import { formatNumber, trimString } from '../../utils/utils';
import { Tooltip, FormatNumber, RowTableTakeoff } from '../../components';

const Order = {
  NONE: 'NONE',
  ASC: 'ASC',
  DESC: 'DESC',
};

const sort = (profiles, sortKey, ordering = Order.DESC) => {
  if (ordering === Order.NONE) {
    return profiles;
  }
  if (sortKey === 'timestamp') {
    return profiles.sort((a, b) => {
      const x = new Date(a[sortKey]);
      const y = new Date(b[sortKey]);
      if (ordering === Order.ASC) {
        return x - y;
      }
      return y - x;
    });
  }
  return profiles.sort((a, b) => {
    const x = a[sortKey];
    const y = b[sortKey];
    if (ordering === Order.ASC) {
      return x - y;
    }
    return y - x;
  });
};

function Table({ data, fUpin, fPin, update, pin }) {
  const [dataTable, setDataTable] = useState({});
  console.log(data);

  useEffect(() => {
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
              {item.txhash}
            </a>
          </div>
          <div className="numberType">{item.timestamp}</div>
          <div className="numberType">{formatNumber(item.amount)}</div>
          <Tooltip
            placement="bottom"
            tooltip={`${formatNumber(Math.floor(item.cybEstimation))} EULs`}
          >
            <div className="numberType">
              <FormatNumber
                number={formatNumber(
                  Math.floor((item.cybEstimation / Math.pow(10, 9)) * 1000) /
                    1000,
                  3
                )}
              />
            </div>
          </Tooltip>
          <Tooltip
            placement="bottom"
            tooltip={`${formatNumber(Math.floor(item.cybEstimation))} CYBs`}
          >
            <div className="numberType">
              <FormatNumber
                number={formatNumber(
                  Math.floor((item.cybEstimation / Math.pow(10, 9)) * 1000) /
                    1000,
                  3
                )}
              />
            </div>
          </Tooltip>
        </div>
      ))}
    >
      <div className="numberType address">{key}</div>
      <div className="numberType">
        {formatNumber(dataTable[key].amountСolumn)}
      </div>
      <Tooltip
        placement="bottom"
        tooltip={`${formatNumber(Math.floor(dataTable[key].cyb))} EULs`}
      >
        <div className="numberType">
          <FormatNumber
            number={formatNumber(
              Math.floor((dataTable[key].cyb / Math.pow(10, 9)) * 1000) / 1000,
              3
            )}
          />
        </div>
      </Tooltip>
      <Tooltip
        placement="bottom"
        tooltip={`${formatNumber(Math.floor(dataTable[key].cyb))} CYBs`}
      >
        <div className="numberType">
          <FormatNumber
            number={formatNumber(
              Math.floor((dataTable[key].cyb / Math.pow(10, 9)) * 1000) / 1000,
              3
            )}
          />
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
              <div className="numberType">{formatNumber(item.amount)}</div>
              <Tooltip
                placement="bottom"
                tooltip={`${formatNumber(Math.floor(item.cybEstimation))} EULs`}
              >
                <div className="numberType">
                  <FormatNumber
                    number={formatNumber(
                      Math.floor(
                        (item.cybEstimation / Math.pow(10, 9)) * 1000
                      ) / 1000,
                      3
                    )}
                  />
                </div>
              </Tooltip>
              <Tooltip
                placement="bottom"
                tooltip={`${formatNumber(Math.floor(item.cybEstimation))} CYBs`}
              >
                <div className="numberType">
                  <FormatNumber
                    number={formatNumber(
                      Math.floor(
                        (item.cybEstimation / Math.pow(10, 9)) * 1000
                      ) / 1000,
                      3
                    )}
                  />
                </div>
              </Tooltip>
            </div>
          ))}
        >
          <div className="numberType address">{key}</div>
          <div className="numberType">
            {formatNumber(dataTable[key].amountСolumn)}
          </div>
          <Tooltip
            placement="bottom"
            tooltip={`${formatNumber(Math.floor(dataTable[key].cyb))} EULs`}
          >
            <div className="numberType">
              <FormatNumber
                number={formatNumber(
                  Math.floor((dataTable[key].cyb / Math.pow(10, 9)) * 1000) /
                    1000,
                  3
                )}
              />
            </div>
          </Tooltip>
          <Tooltip
            placement="bottom"
            tooltip={`${formatNumber(Math.floor(dataTable[key].cyb))} CYBs`}
          >
            <div className="numberType">
              <FormatNumber
                number={formatNumber(
                  Math.floor((dataTable[key].cyb / Math.pow(10, 9)) * 1000) /
                    1000,
                  3
                )}
              />
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
            ATOMs
            {/* <Icon
                icon="double-caret-vertical"
                color="#3ab793d4"
                marginLeft={5}
              /> */}
          </div>
          <div className="numberType sort-row">
            GEUL estimation
            {/* <Icon
                icon="double-caret-vertical"
                color="#3ab793d4"
                marginLeft={5}
              /> */}
          </div>
          <div className="numberType sort-row">
            GCYB estimation
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
