import React, { Component } from 'react';

export class SeeSaw extends Component {
  render() {
    const { win } = this.props;

    return (
      <div className="boxWrap">
        <div className={` ${win==='eth' ? 'wrapper-eth-win': win==='atom' ? 'wrapper-atom-win': 'wrapper' }`}>
          <div className="bar">
            <div className="box1"> </div>
            <div className="box2"> </div>
          </div>
        </div>
        <div className="seesaw-bottom" />
      </div>
    );
  }
}
