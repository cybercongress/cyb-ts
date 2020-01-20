import React, { PureComponent } from 'react';
import { Pane, Text } from '@cybercongress/gravity';
import { fromWei, toBN, toWei } from 'web3-utils';
import injectWeb3Vesting from '../../components/web3/web3Vesting';
import { Loading } from '../../components/index';
import {
  run,
  formatNumber,
  roundNumber,
  asyncForEach,
  timer,
} from '../../utils/utils';

import { AUCTION } from '../../utils/config';
import VestingConstract from '../../../contracts/Vesting.json';
import TokenManager from '../../../contracts/TokenManager.json';
import Token from '../../../contracts/Token.json';

const {
  ADDR_SMART_CONTRACT,
  TOKEN_NAME,
  TOPICS_SEND,
  TOPICS_CLAIM,
  ADDR_VESTING,
} = AUCTION;
const ROUND_DURATION = 1 * 60 * 60;

class Vesting extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      table: [],
      accounts: null,
      balance: 0,
      spendableBalance: 0,
    };
  }

  componentDidMount() {
    this.init();
  }

  init = async () => {
    const { accounts, contractTokenManager, contractToken } = this.props;

    console.log('accounts', accounts);

    const balance = await contractToken.methods.balanceOf(accounts).call();
    const spendableBalance = await contractTokenManager.methods
      .spendableBalanceOf(accounts)
      .call();

    this.setState({
      balance,
      spendableBalance,
    });
  };

  render() {
    const { spendableBalance, balance } = this.state;
    // console.log(table);
    return (
      <div>
        <div>{spendableBalance}</div>
        <div>{spendableBalance - balance}</div>
        <div>{balance}</div>
      </div>
    );
  }
}

export default injectWeb3Vesting(Vesting);
