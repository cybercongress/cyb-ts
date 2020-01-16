import React, { Component } from 'react';
import { formatNumber } from '../../utils/utils';
import { Tooltip, FormatNumber, RowTableTakeoff } from '../../components';
import { Icon } from '@cybercongress/gravity';

const Order = {
  NONE: 'NONE',
  ASC: 'ASC',
  DESC: 'DESC',
};

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pin: false,
      loader: false,
      ordering: Order.DESC,
      sortKey: 'amountСolumn',
      currentPage: 1,
      todosPerPage: 3,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    this.setState({
      currentPage: Number(event.target.id),
    });
  }

  sortTime = () => {
    const { ordering } = this.state;
    if (ordering === Order.ASC) {
      return this.setState({
        ordering: 'DESC',
        sortKey: 'height',
      });
    }
    return this.setState({
      ordering: 'ASC',
      sortKey: 'height',
    });
  };

  sortCyb = () => {
    const { ordering } = this.state;
    if (ordering === Order.ASC) {
      return this.setState({
        ordering: 'DESC',
        sortKey: 'cyb',
      });
    }
    return this.setState({
      ordering: 'ASC',
      sortKey: 'cyb',
    });
  };

  sortAtom = () => {
    const { ordering } = this.state;
    if (ordering === Order.ASC) {
      return this.setState({
        ordering: 'DESC',
        sortKey: 'amountСolumn',
      });
    }
    return this.setState({
      ordering: 'ASC',
      sortKey: 'amountСolumn',
    });
  };

  sort = profiles => {
    const { ordering, sortKey } = this.state;
    console.log('ordering', ordering);
    if (ordering === Order.NONE) return profiles;
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

  render() {
    const {
      data,
      dataPinTable,
      pin,
      update,
      onClickSortTime,
      onClickSortSyb,
    } = this.props;
    const {
      loader,
      sortSyb,
      sortAtom,
      asc,
      todosPerPage,
      currentPage,
    } = this.state;

    console.log(data);

    const sortData = this.sort(data);

    const tableRowPin = () =>
      sortData
        .filter(data => data.pin)
        .map((itemGroup, index) => (
          <RowTableTakeoff
            pin={itemGroup}
            unPin
            unPinFunc={this.props.fUpin}
            pinFunc={this.props.fPin}
            updateList={update}
            statePin={itemGroup.pin}
            key={itemGroup.group}
            item={itemGroup.address.map((item, index) => (
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
                  tooltip={`${formatNumber(
                    Math.floor(item.cybEstimation)
                  )} CYBs`}
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
            <div className="numberType address">{itemGroup.group}</div>
            <div className="numberType">
              {formatNumber(itemGroup.amountСolumn)}
            </div>
            <Tooltip
              placement="bottom"
              tooltip={`${formatNumber(Math.floor(itemGroup.cyb))} CYBs`}
            >
              <div className="numberType">
                <FormatNumber
                  number={formatNumber(
                    Math.floor((itemGroup.cyb / Math.pow(10, 9)) * 1000) / 1000,
                    3
                  )}
                />
              </div>
            </Tooltip>
          </RowTableTakeoff>
        ));

    const tableRow = sortData.map((itemGroup, index) => (
      <RowTableTakeoff
        pin={itemGroup}
        unPin
        unPinFunc={this.props.fUpin}
        pinFunc={this.props.fPin}
        updateList={update}
        key={itemGroup.group}
        statePin={itemGroup.pin}
        item={itemGroup.address.map((item, index) => (
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
        <div className="numberType address">{itemGroup.group}</div>
        <div className="numberType">{formatNumber(itemGroup.amountСolumn)}</div>
        <Tooltip
          placement="bottom"
          tooltip={`${formatNumber(Math.floor(itemGroup.cyb))} CYBs`}
        >
          <div className="numberType">
            <FormatNumber
              number={formatNumber(
                Math.floor((itemGroup.cyb / Math.pow(10, 9)) * 1000) / 1000,
                3
              )}
            />
          </div>
        </Tooltip>
      </RowTableTakeoff>
    ));
    if (loader) {
      return <div>...</div>;
    }
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
}

export default Table;
