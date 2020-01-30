import React from 'react';
import GetLink from './link';
import { getBalance, getTotalEUL } from '../../utils/search/utils';
import Balance from './balance';
import Staking from './staking';

class AccountDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: 'cyber1gw5kdey7fs9wdh05w66s0h4s24tjdvtcp5fhky',
      balance: {
        available: 0,
        delegation: 0,
        unbonding: 0,
        rewards: 0,
        total: 0,
      },
      staking: {
        delegations: [],
        unbonding: [],
      },
    };
  }

  componentDidMount() {
    this.getBalanseAccount();
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (prevProps.location.pathname !== location.pathname) {
      this.getBalanseAccount();
    }
  }

  getBalanseAccount = async () => {
    const { match } = this.props;
    const { account } = match.params;
    await this.setState({ account });

    let total = 0;
    const staking = {
      delegations: [],
      unbonding: [],
    };

    const result = await getBalance(account);

    console.log('data', result);

    if (result) {
      total = getTotalEUL(result);
      staking.delegations = result.delegations;
      staking.unbonding = result.unbonding;
    }

    console.log('total', total);
    this.setState({ balance: total, staking });
  };

  render() {
    const { account, balance, staking } = this.state;

    return (
      <main className="block-body">
        <Balance marginBottom={20} account={account} balance={balance} />
        <Staking marginBottom={20} data={staking} />
        <GetLink accountUser={account} />
      </main>
    );
  }
}

export default AccountDetails;
