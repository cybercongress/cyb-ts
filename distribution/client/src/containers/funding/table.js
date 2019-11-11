import React, { Component } from 'react';
import { formatNumber } from '../../utils/utils';
import { Tooltip, FormatNumber } from '../../components/index';

const imgSort = require('../../image/_ionicons_svg_ios-swap.svg');

const Order = {
  NONE: 'NONE',
  ASC: 'ASC',
  DESC: 'DESC'
};

class Row extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  open = () => {
    this.setState({
      open: !this.state.open
    });
  };

  funcPin = item => {
    this.props.pinFunc(item);
  };

  funcUnPin = item => {
    this.props.unPinFunc(item);
  };

  render() {
    const { open } = this.state;
    const { item, children, pin, statePin } = this.props;

    return (
      <div>
        <div
          className={`${
            statePin ? 'container-row-pin-padding0' : 'container-row-pin'
          }`}
        >
          {!statePin && (
            <button className="pin" onClick={e => this.funcPin(pin)} />
          )}
          {statePin && (
            <button className="unpin" onClick={e => this.funcUnPin(pin)} />
          )}
          <div onClick={this.open} className="table-rows-box">
            {children}
          </div>
        </div>
        <div className={`box ${open ? 'open' : 'close'}`}>{item}</div>
      </div>
    );
  }
}

export class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pin: false,
      loader: false,
      ordering: Order.NONE,
      sortKey: null
    };
  }

  sortTime = () => {
    const { ordering } = this.state;
    if (ordering === Order.ASC) {
      return this.setState({
        ordering: 'DESC',
        sortKey: 'timestamp'
      });
    }
    return this.setState({
      ordering: 'ASC',
      sortKey: 'timestamp'
    });
  };

  sortCyb = () => {
    const { ordering } = this.state;
    if (ordering === Order.ASC) {
      return this.setState({
        ordering: 'DESC',
        sortKey: 'cyb'
      });
    }
    return this.setState({
      ordering: 'ASC',
      sortKey: 'cyb'
    });
  };

  sortAtom = () => {
    const { ordering } = this.state;
    if (ordering === Order.ASC) {
      return this.setState({
        ordering: 'DESC',
        sortKey: 'amountСolumn'
      });
    }
    return this.setState({
      ordering: 'ASC',
      sortKey: 'amountСolumn'
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
        if (this.state.ordering === Order.ASC) {
          return x - y;
        }
        return y - x;
      });
    }
    return profiles.sort((a, b) => {
      const x = a[sortKey];
      const y = b[sortKey];
      if (this.state.ordering === Order.ASC) {
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
      onClickSortSyb
    } = this.props;
    const { loader, sortSyb, sortAtom, asc } = this.state;

    const sortData = this.sort(data);

    const tableRowPin = () =>
      sortData
        .filter(data => data.pin)
        .map((itemGroup, index) => (
          <Row
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
          </Row>
        ));

    const tableRow = sortData.map((itemGroup, index) => (
      <Row
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
      </Row>
    ));
    if (loader) {
      return <div>...</div>;
    }
    return (
      <div>
        <div className="table">
          <div className="table-header-rows">
            <div className="numberType address">Address (TX id)</div>
            <div className="numberType sort-row" onClick={this.sortTime}>
              Height
              <img className="icon-sort" alt="sort" src={imgSort} />
            </div>
            <div className="numberType sort-row" onClick={this.sortAtom}>
              ATOMs
              <img className="icon-sort" alt="sort" src={imgSort} />
            </div>
            <div className="numberType sort-row" onClick={this.sortCyb}>
              GCYB estimation
              <img className="icon-sort" alt="sort" src={imgSort} />
            </div>
          </div>
          {pin && (
            <div
              className="table-body"
              style={{
                marginBottom: 10,
                paddingBottom: 10,
                borderBottom: '1px solid #fff'
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
