import React, { Component } from 'react';
import { ActionBar } from '@cybercongress/gravity';
import { ActionBarContainer as ActionBarAtom } from '../funding/actionBar';
import { ActionBarContainer as ActionBarETH} from '../auction/actionBar'

export class ActionBarContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 'start',
            select: 'atom',
        };
    }

    onChangeSelect = (event) => {
        this.setState({
            select: event.target.value
        });
    }

    onClickSelect = () => {
        const { select } = this.state;
        this.setState({
            step: select
        });
    }

    render() {
        if (this.state.step === 'start') {
            return (
                <ActionBar>
                    <div className="action-text">
                        <span className="actionBar-text">
                            Contribute ETH/ATOMs using
                        </span>
                        <select onChange={this.onChangeSelect}>
                            <option value='atom'>ATOMs</option>
                            <option value='eth'>ETH</option>
                        </select>
                    </div>
                    <button className="btn" onClick={this.onClickSelect}>Fuck Google</button>
                </ActionBar>
            );
        }

        if(this.state.step === 'atom') {
            return(
                <ActionBarAtom />
            );
        }

        if(this.state.step === 'eth') {
            return(
                <ActionBarETH
                    web3={this.props.web3}
                    contract={this.props.contract}
                    minRound={59}
                    maxRound={60}
                />
            );
        }
    }
}
