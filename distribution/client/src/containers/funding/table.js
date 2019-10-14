import React, { Component } from 'react';
import { formatNumber } from '../../utils/utils';
import { Tooltip } from '../../components/index';

class Row extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      // statePin: true
    };
  }

  open = () => {
    this.setState({
      open: !this.state.open
    });
  };

  // componentDidMount() {
  //   const { pin } = this.props;
  //   const allPin = JSON.parse(localStorage.getItem('allpin'));
  //   // console.log(allPin);
  //   // console.log(pin.group);
  //   if (allPin != null) {
  //     for (let i = 0; i < allPin.length; i++) {
  //       if (allPin[i].group.indexOf(`${pin.group}`) !== -1) {
  //         this.setState({
  //           statePin: false
  //         });
  //       }
  //     }
  //   }
  // }

  funcPin = item => {
    // let allPin = JSON.parse(localStorage.getItem('allpin'));
    // if (allPin == null) allPin = [];
    // const { group } = item;
    // const value = item;
    // const pin = {
    //   group,
    //   value
    // };
    // localStorage.setItem(`item_pin`, JSON.stringify(pin));
    // allPin.push(pin);
    // localStorage.setItem('allpin', JSON.stringify(allPin));
    // this.props.updateList(allPin);
    this.props.pinFunc(item);
    // this.setState({
    //   statePin: false
    // });
  };

  funcUnPin = item => {
    // const tempArr = localStorage.getItem('allpin');
    // const allPin = JSON.parse(tempArr);
    // if (allPin != null) {
    //   for (let i = 0; i < allPin.length; i++) {
    //     const tempindexItem = allPin[i].group.indexOf(`${item.group}`) !== -1;
    //     if (tempindexItem) {
    //       allPin.splice(i, 1);
    //       localStorage.setItem('allpin', JSON.stringify(allPin));
    //       this.props.updateList(allPin);
    //     }
    //   }
    this.props.unPinFunc(item);
      // this.setState({
      //   statePin: true
      // });
    // }
  };

  render() {
    const { open } = this.state;
    const { item, children, pin, unPin, statePin } = this.props;
    const allPin = JSON.parse(localStorage.getItem('allpin'));
    // console.log(pin.group);

    //   allPin.map(item => {
    //   const index = item.group.indexOf('cyber1hmkqhy8ygl6tnl5g8tc503rwrmmrkjcq4878e0');
    //   console.log(index);
    // });
    return (
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center'
          }}
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
    // const data = [];
    // const jsonStr = localStorage.getItem('allpin');
    // data.push(JSON.parse(jsonStr));
    this.state = {
      pin: false,
      // dataPinTable: data,
      loader: false,
      sortAtom: false,
      sortSyb: false,
      asc: false
    };
  }

  // updateList = data => {
  //   // console.log(data);
  //   const tempArr = [];
  //   let pin = false;
  //   tempArr.push(data);
  //   if (tempArr[0] != null) {
  //     if (tempArr[0].length) {
  //       pin = true;
  //     }
  //   }
  //   this.setState({
  //     dataPinTable: tempArr,
  //     pin
  //   });
  // };

  sortAtom = () => {
    this.setState({
      sortAtom: true,
      sortSyb: false,
      asc: !this.state.asc
    });
  };

  sortCyb = () => {
    this.setState({
      sortAtom: false,
      sortSyb: true,
      asc: !this.state.asc
    });
  };
  // getCellValue = (tr, idx) =>
  //   tr.children[idx].innerText || tr.children[idx].textContent;

  // comparer = (idx, asc) => (a, b) =>
  //   ((v1, v2) =>
  //     v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2)
  //       ? v1 - v2
  //       : v1.toString().localeCompare(v2))(
  //     this.getCellValue(asc ? a : b, idx),
  //     this.getCellValue(asc ? b : a, idx)
  //   );

  // componentDidMount() {
  //   const dataPin = [];
  //   const jsonStr = localStorage.getItem('allpin');
  //   dataPin.push(JSON.parse(jsonStr));
  //   if (dataPin[0] != null) {
  //     if (dataPin[0].length) {
  //       this.setState({
  //         pin: true
  //       });
  //     }
  //   }
  //   this.setState({
  //     loader: false
  //   });
  // }

  render() {
    const { data, dataPinTable, pin, update } = this.props;
    const { loader, sortSyb, sortAtom, asc } = this.state;
    if (sortSyb) {
      data.sort((a, b) => {
        const x = a.cyb;
        const y = b.cyb;
        return asc ? x - y : y - x;
      });
    }
    if (sortAtom) {
      data.sort((a, b) => {
        const x = a.amountСolumn;
        const y = b.amountСolumn;
        return asc ? x - y : y - x;
      });
    }
    const tableRowPin = () =>
    data.filter(data => data.pin).map((itemGroup, index) => (
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
            <div className="number hash">
              <a href={`https://cosmos.bigdipper.live/transactions/${item.txhash}`}>
                {item.txhash}
              </a>
            </div>
            <div className="number">{item.height}</div>
            <div className="number">{formatNumber(item.amount)}</div>
            <Tooltip
              placement="bottom"
              tooltip={`${formatNumber(Math.floor(item.cybEstimation))} CYBs`}
            >
              <div className="number">
                {formatNumber(
                  Math.floor((item.cybEstimation / Math.pow(10, 9)) * 1000) /
                    1000
                )}
              </div>
            </Tooltip>
          </div>
        ))}
      >
        <div className="number address">{itemGroup.group}</div>
        <div className="number">{formatNumber(itemGroup.amountСolumn)}</div>
        <Tooltip
          placement="bottom"
          tooltip={`${formatNumber(Math.floor(itemGroup.cyb))} CYBs`}
        >
          <div className="number">
            {formatNumber(
              Math.floor((itemGroup.cyb / Math.pow(10, 9)) * 1000) / 1000
            )}
          </div>
        </Tooltip>
      </Row>
    ));

    const tableRow = data.map((itemGroup, index) => (
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
            <div className="number hash">
              <a href={`https://cosmos.bigdipper.live/transactions/${item.txhash}`}>
                {item.txhash}
              </a>
            </div>
            <div className="number">{item.height}</div>
            <div className="number">{formatNumber(item.amount)}</div>
            <Tooltip
              placement="bottom"
              tooltip={`${formatNumber(Math.floor(item.cybEstimation))} CYBs`}
            >
              <div className="number">
                {formatNumber(
                  Math.floor((item.cybEstimation / Math.pow(10, 9)) * 1000) /
                    1000
                )}
              </div>
            </Tooltip>
          </div>
        ))}
      >
        <div className="number address">{itemGroup.group}</div>
        <div className="number">{formatNumber(itemGroup.amountСolumn)}</div>
        <Tooltip
          placement="bottom"
          tooltip={`${formatNumber(Math.floor(itemGroup.cyb))} CYBs`}
        >
          <div className="number">
            {formatNumber(
              Math.floor((itemGroup.cyb / Math.pow(10, 9)) * 1000) / 1000
            )}
          </div>
        </Tooltip>
      </Row>
    ));
    if (loader) {
      return <div>...</div>;
    }
    return (
      <div>
        <div className='text-align-center'>Contributions history</div>
        <div className="table">
          <div className="table-header-rows">
            <div className="number address">Address (TX id)</div>
            <div className="number">Height</div>
            <div className="number sort-row" onClick={this.sortAtom}>
              ATOMs
              <div className={`triangle ${sortAtom && asc ? 'asc' : ''}`} />
            </div>
            <div className="number sort-row" onClick={this.sortCyb}>
              GCYB estimation
              <div className={`triangle ${sortSyb && asc ? 'asc' : ''}`} />
            </div>
          </div>
          {pin && (
            <div
              className="table-body"
              style={{
                marginBottom: 20,
                paddingBottom: 10,
                borderBottom: '1px solid #fff6'
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
