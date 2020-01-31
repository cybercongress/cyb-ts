import React from 'react';
import GetLink from './link';
import {
  getBalance,
  getTotalEUL,
  getDistribution,
} from '../../utils/search/utils';
import Balance from './balance';
import Staking from './staking';
import { getDelegator } from '../../utils/utils';
import { Loading } from '../../components';

class AccountDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      loader: true,
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
    let total;
    const staking = {
      delegations: [],
      unbonding: [],
    };

    await this.setState({ account, loader: true });

    const result = await getBalance(account);
    console.log('result', result);

    const validatorAddress = getDelegator(account, 'cybervaloper');

    const resultGetDistribution = await getDistribution(validatorAddress);

    if (resultGetDistribution) {
      result.val_commission = resultGetDistribution.val_commission;
    }
    if (result) {
      total = await getTotalEUL(result);
      if (result.delegations && result.delegations.length > 0) {
        staking.delegations = result.delegations;
      }
      if (result.unbonding && result.unbonding.length > 0) {
        staking.unbonding = result.unbonding;
      }
    }

    this.setState({ balance: total, staking, loader: false });
  };

  render() {
    const { account, balance, staking, loader } = this.state;

    console.log(balance);

    if (loader) {
      return (
        <div
          style={{
            height: '50vh',
          }}
          className="container-loading"
        >
          <Loading />
        </div>
      );
    }

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
