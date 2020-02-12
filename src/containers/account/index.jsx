import React from 'react';
import { Tablist, Tab, Pane, Text } from '@cybercongress/gravity';
import { Route, Link } from 'react-router-dom';
import GetLink from './link';
import {
  getBalance,
  getTotalEUL,
  getDistribution,
  getRewards,
} from '../../utils/search/utils';
// import Balance fro./mainnce';
import Heroes from './heroes';
import Unbondings from './unbondings';
import { getDelegator, formatNumber, asyncForEach } from '../../utils/utils';
import { Loading, Copy, ContainerCard, Card } from '../../components';
import ActionBarContainer from '../Wallet/actionBarContainer';
import GetTxs from './txs';
import Main from './main';

const TabBtn = ({ text, isSelected, onSelect, to }) => (
  <Link to={to}>
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
  </Link>
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
    this.chekPathname();
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (prevProps.location.pathname !== location.pathname) {
      this.init();
      this.chekPathname();
    }
  }

  init = async () => {
    // this.setState({ loader: true });
    this.getBalanseAccount();
  };

  chekPathname = () => {
    const { location } = this.props;
    const { pathname } = location;

    if (pathname.match(/txs/gm) && pathname.match(/txs/gm).length > 0) {
      this.select('txs');
    } else if (
      pathname.match(/cyberlink/gm) &&
      pathname.match(/cyberlink/gm).length > 0
    ) {
      this.select('cyberlink');
    } else if (
      pathname.match(/heroes/gm) &&
      pathname.match(/heroes/gm).length > 0
    ) {
      this.select('heroes');
    } else {
      this.select('main');
    }
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
        await asyncForEach(
          Array.from(Array(staking.delegations.length).keys()),
          async item => {
            let reward = 0;
            const resultRewards = await getRewards(
              account,
              staking.delegations[item].validator_address
            );
            if (resultRewards) {
              reward = parseFloat(resultRewards[0].amount);
              staking.delegations[item].reward = Math.floor(reward);
            }
          }
        );
      }

      if (result.unbonding && result.unbonding.length > 0) {
        staking.delegations.map((item, index) => {
          return result.unbonding.map(itemUnb => {
            if (item.validator_address === itemUnb.validator_address) {
              staking.delegations[index].entries = itemUnb.entries;
            }
            return staking.delegations[index];
          });
        });
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
      content = (
        <Route
          path="/account/:address/heroes"
          render={() => <Heroes data={staking} />}
        />
      );
    }

    if (selected === 'main') {
      content = <Main balance={balance} />;
    }

    if (selected === 'cyberlink') {
      content = (
        <Route
          path="/account/:address/cyberlink"
          render={() => <GetLink accountUser={account} />}
        />
      );
    }

    if (selected === 'txs') {
      content = (
        <Route
          path="/account/:address/txs"
          render={() => <GetTxs accountUser={account} />}
        />
      );
    }

    return (
      <div>
        <main className="block-body">
          <Pane
            marginBottom={20}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Text color="#fff" fontSize="18px">
              {account} <Copy text={account} />
            </Text>
          </Pane>
          <ContainerCard col={1}>
            <Card title="total, EUL" value={formatNumber(balance.total)} />
          </ContainerCard>
          <Tablist display="flex" justifyContent="center">
            <TabBtn
              text="Link"
              isSelected={selected === 'cyberlink'}
              to={`/account/${account}/cyberlink`}
            />
            <TabBtn
              text="Heroes"
              isSelected={selected === 'heroes'}
              to={`/account/${account}/heroes`}
            />
            <TabBtn
              text="Main"
              isSelected={selected === 'main'}
              to={`/account/${account}`}
            />
            <TabBtn
              text="Txs"
              isSelected={selected === 'txs'}
              to={`/account/${account}/txs`}
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
