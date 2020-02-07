import React from 'react';
import { Tablist, Tab, Pane } from '@cybercongress/gravity';
import GetLink from './link';
import {
  getBalance,
  getTotalEUL,
  getDistribution,
} from '../../utils/search/utils';
import Balance from './balance';
import Heroes from './heroes';
import Unbondings from './unbondings';
import { getDelegator } from '../../utils/utils';
import { Loading } from '../../components';
import ActionBarContainer from '../Wallet/actionBarContainer';

const TabBtn = ({ text, isSelected, onSelect }) => (
  <Tab
    key={text}
    isSelected={isSelected}
    onSelect={onSelect}
    paddingX={50}
    paddingY={20}
    marginX={3}
    borderRadius={4}
    color="#36d6ae"
    boxShadow="0px 0px 5px #36d6ae"
    fontSize="16px"
    whiteSpace="nowrap"
  >
    {text}
  </Tab>
);

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
      selected: 'link',
    };
  }

  componentDidMount() {
    this.init();
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (prevProps.location.pathname !== location.pathname) {
      this.init();
    }
  }

  init = async () => {
    this.setState({ loader: true });
    this.getBalanseAccount();
  };

  getBalanseAccount = async () => {
    const { match } = this.props;
    const { account } = match.params;
    let total;
    const staking = {
      delegations: [],
      unbonding: [],
    };

    await this.setState({ account });

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

  select = selected => {
    this.setState({ selected });
  };

  render() {
    const { account, balance, staking, selected, loader } = this.state;
    let content;

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

    if (selected === 'heroes') {
      content = <Heroes data={staking} />;
    }

    if (selected === 'unbondings') {
      content = <Unbondings data={staking} />;
    }

    if (selected === 'link') {
      content = <GetLink accountUser={account} />;
    }

    return (
      <div>
        <main className="block-body">
          <Balance marginBottom={20} account={account} balance={balance} />
          <Tablist>
            <TabBtn
              text="Link"
              isSelected={selected === 'link'}
              onSelect={() => this.select('link')}
            />
            <TabBtn
              text="Heroes"
              isSelected={selected === 'heroes'}
              onSelect={() => this.select('heroes')}
            />
            <TabBtn
              text="Unbondings"
              isSelected={selected === 'unbondings'}
              onSelect={() => this.select('unbondings')}
            />
          </Tablist>
          <Pane
            display="flex"
            marginTop={20}
            marginBottom={50}
            justifyContent="center"
            flexDirection="column"
          >
            {content}
          </Pane>
        </main>
        <ActionBarContainer
          updateAddress={this.getBalanseAccount}
          addressSend={account}
        />
      </div>
    );
  }
}

export default AccountDetails;
