import React, { Component } from 'react';

class RowTableTakeoff extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  open = () => {
    this.setState({
      open: !this.state.open,
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
            <button
              type="button"
              className="pin"
              onClick={e => this.funcPin(pin)}
            />
          )}
          {statePin && (
            <button
              type="button"
              className="unpin"
              onClick={e => this.funcUnPin(pin)}
            />
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

export default RowTableTakeoff;
