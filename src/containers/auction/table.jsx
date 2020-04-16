import React, { Component } from 'react';
import { ClaimedRound } from './claimed';
import { FormatNumber } from '../../components/index';

const Table = ({ data, TOKEN_NAME, claimed, web3, contract, round }) => {
  const tableRow = data.map(item => {
    let closing;
    if (item.closing > 0) {
      closing = `${item.closing} day ago`;
    } else if (item.closing < 0) {
      closing = `in ${item.closing * -1} days`;
    } else {
      closing = 'now';
    }
    return (
      <div
        className={`table-rows ${item.period === round ? 'active-row' : ''}`}
        key={item.period}
      >
        <div className="table-index-col">{item.period}</div>
        <div className="numberType">
          <FormatNumber number={item.dist} />
        </div>
        <div className="numberType">
          <FormatNumber number={item.total} />
        </div>
        <div className="numberType">
          <FormatNumber number={item.price} />
        </div>
        <div className="numberType" style={{ justifyContent: 'center' }}>
          {closing}
        </div>
        <div className="numberType">
          <FormatNumber number={item.youETH} />
        </div>
        <div className="numberType">
          <FormatNumber number={item.youCYB} />
        </div>
        {item.claimed && (
          <div className="table-btn-col">
            <ClaimedRound day={item.claimed} contract={contract} web3={web3}>
              Claim
            </ClaimedRound>
          </div>
        )}
      </div>
    );
  });
  return (
    <div className={`table ${claimed ? 'claimed' : ''}`}>
      <div className="table-header-rows">
        <div className="numberType">Round</div>
        <div className="numberType">Distributed, G{TOKEN_NAME}</div>
        <div className="numberType">Total, ETH</div>
        <div className="numberType">Price, ETH/G{TOKEN_NAME}</div>
        <div className="numberType">Closing</div>
        <div className="numberType">Your ETH</div>
        <div className="numberType">Your G{TOKEN_NAME}</div>
        {/* {claimed && (
            <div className="table-btn-col">
              <ClaimedAll
                contract={contract}
                web3={web3}
                className="bnt-claime"
              >
                Claim All
              </ClaimedAll>
            </div>
          )} */}
      </div>
      <div
        style={{
          height: 'calc(30px * 5)',
          overflowX: 'hidden',
          overflowY: 'auto',
        }}
        className="table-body"
      >
        {tableRow}
      </div>
    </div>
  );
};

export default Table;
