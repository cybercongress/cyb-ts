import React, { Component } from "react";
import { ClaimedRound } from "./claimed";
import { FormatNumber } from '../../components/index';

export class Table extends Component {
    render() {
        const { data, TOKEN_NAME, claimed, web3, contract, round } = this.props;
        const tableRow = data.map(item => (
            <div
                className={`table-rows ${
                    item.period == round ? "active-row" : ""
                }`}
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
                <div className="numberType" style={{ justifyContent: "center" }}>
                    {item.closing > 0
                        ? `${item.closing} day ago`
                        : item.closing < 0
                        ? `in ${item.closing * -1} days`
                        : "now"}
                </div>
                <div className="numberType">
                    <FormatNumber number={item.youETH} />
                </div>
                <div className="numberType">
                    <FormatNumber number={item.youCYB} />
                </div>
                {item.claimed && (
                    <div className="table-btn-col">
                        <ClaimedRound
                            day={item.claimed}
                            contract={contract}
                            web3={web3}
                        >
                            Claim
                        </ClaimedRound>
                    </div>
                )}
            </div>
        ));
        return (
            <div className={`table ${claimed ? "claimed" : ""}`}>
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
                <div className="table-body">{tableRow}</div>
            </div>
        );
    }
}
