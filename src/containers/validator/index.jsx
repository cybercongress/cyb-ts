import React from 'react';
import { Tablist, Tab, Pane, Text } from '@cybercongress/gravity';
import { Route, Link } from 'react-router-dom';
import ValidatorInfo from './validatorInfo';
import {
  getValidatorsInfo,
  stakingPool,
  selfDelegationShares,
  getDelegators,
} from '../../utils/search/utils';
import { getDelegator } from '../../utils/utils';
import { Loading, Copy } from '../../components';
import Burden from './burden';
import Delegated from './delegated';
import Fans from './fans';
import NotFound from '../application/notFound';
import ActionBarContainer from '../Validators/ActionBarContainer';
import Leadership from './leadership';
import Rumors from './rumors';

const TabBtn = ({ text, isSelected, onSelect, to }) => (
  <Link to={to}>
    <Tab
      key={text}
      isSelected={isSelected}
      onSelect={onSelect}
      paddingX={20}
      paddingY={20}
      marginX={3}
      borderRadius={4}
      color="#36d6ae"
      boxShadow="0px 0px 5px #36d6ae"
      fontSize="16px"
      whiteSpace="nowrap"
      minWidth="150px"
    >
      {text}
    </Tab>
  </Link>
);
class ValidatorsDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selected: 'main',
      validatorInfo: [],
      data: {},
      delegated: {},
      loader: true,
      error: false,
      fans: [],
      addressLedger: null,
      unStake: false,
    };
  }

  componentDidMount() {
    const localStorageStory = localStorage.getItem('ledger');
    if (localStorageStory !== null) {
      const address = JSON.parse(localStorageStory);
      console.log('address', address);
      this.setState({ addressLedger: address.bech32 });
    }
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

  chekPathname = () => {
    const { location } = this.props;
    const { pathname } = location;

    if (
      pathname.match(/leadership/gm) &&
      pathname.match(/leadership/gm).length > 0
    ) {
      this.select('leadership');
    } else if (
      pathname.match(/fans/gm) &&
      pathname.match(/fans/gm).length > 0
    ) {
      this.select('fans');
    } else if (
      pathname.match(/burden/gm) &&
      pathname.match(/burden/gm).length > 0
    ) {
      this.select('burden');
    } else if (
      pathname.match(/rumors/gm) &&
      pathname.match(/rumors/gm).length > 0
    ) {
      this.select('rumors');
    } else {
      this.select('main');
    }
  };

  init = async () => {
    // this.setState({ loader: true });
    await this.getValidatorInfo();
    this.getDelegators();
  };

  update = async () => {
    await this.getValidatorInfo();
    this.getDelegators();
  };

  getSupply = async () => {
    const bondedTokens = await stakingPool();
    return bondedTokens.bonded_tokens;
  };

  getDelegated = async (delegatorShares, delegateAddress, operatorAddress) => {
    const data = {
      self: 0,
      selfPercent: 0,
      others: 0,
      othersPercent: 0,
    };

    const getSelfDelegation = await selfDelegationShares(
      delegateAddress,
      operatorAddress
    );

    if (getSelfDelegation && delegatorShares > 0) {
      const selfPercent = (getSelfDelegation / delegatorShares) * 100;

      data.self = parseFloat(getSelfDelegation);
      data.selfPercent = selfPercent;
      data.others = parseFloat(delegatorShares);
      data.othersPercent = 100 - selfPercent;
    }

    return data;
  };

  getValidatorInfo = async () => {
    const { match } = this.props;
    const { address } = match.params;

    const resultStakingPool = await this.getSupply();
    const result = await getValidatorsInfo(address);

    if (result === null) {
      return this.setState({ error: true, loader: false });
    }

    const delegateAddress = getDelegator(result.operator_address);

    const votingPower = (result.tokens / resultStakingPool) * 100;
    const delegated = await this.getDelegated(
      result.delegator_shares,
      delegateAddress,
      result.operator_address
    );

    return this.setState({
      validatorInfo: {
        delegateAddress,
        ...result,
        votingPower,
      },
      delegated: {
        total: parseFloat(result.tokens),
        delegateAddress,
        jailed: result.jailed,
        unbondingTime: result.unbonding_time,
        unbondingHeight: result.unbonding_height,
        delegatorShares: result.delegator_shares,
        ...delegated,
        ...result,
      },
    });
  };

  getDelegators = async () => {
    const { match } = this.props;
    const { address } = match.params;
    const { validatorInfo, addressLedger, unStake } = this.state;

    let fans = [];

    const data = await getDelegators(address);

    if (data !== null) {
      fans = data.result;
      Object.keys(fans).forEach(key => {
        if (unStake === false) {
          if (fans[key].delegator_address === addressLedger) {
            this.setState({
              unStake: true,
            });
          }
        }
        fans[key].share =
          parseFloat(fans[key].balance.amount) /
          Math.floor(parseFloat(validatorInfo.delegator_shares));
      });
    }

    this.setState({
      fans,
      loader: false,
    });
  };

  select = selected => {
    this.setState({ selected });
  };

  render() {
    const {
      validatorInfo,
      loader,
      delegated,
      fans,
      error,
      selected,
      data,
      addressLedger,
      unStake,
    } = this.state;
    const { match } = this.props;
    const { address } = match.params;
    // console.log('validatorInfo', validatorInfo.consensus_pubkey);
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

    if (error) {
      return <NotFound />;
    }

    if (selected === 'main') {
      content = <Delegated data={delegated} />;
    }

    if (selected === 'fans') {
      content = (
        <Route
          path="/network/euler-5/hero/:address/fans"
          render={() => <Fans data={fans} />}
        />
      );
    }
    if (selected === 'rumors') {
      content = (
        <Route
          path="/network/euler-5/hero/:address/rumors"
          render={() => <Rumors accountUser={validatorInfo.operator_address} />}
        />
      );
    }
    if (selected === 'burden') {
      content = (
        <Route
          path="/network/euler-5/hero/:address/burden"
          render={() => <Burden accountUser={validatorInfo.consensus_pubkey} />}
        />
      );
    }
    if (selected === 'leadership') {
      content = (
        <Route
          path="/network/euler-5/hero/:address/leadership"
          render={() => (
            <Leadership accountUser={validatorInfo.delegateAddress} />
          )}
        />
      );
    }

    return (
      <div>
        <main className="block-body">
          <Pane
            marginBottom={40}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Text color="#fff" fontSize="18px">
              {validatorInfo.operator_address}{' '}
              <Copy text={validatorInfo.operator_address} />
            </Text>
          </Pane>
          <ValidatorInfo data={validatorInfo} marginBottom={20} />
          <Tablist display="flex" justifyContent="center">
            <TabBtn
              text="Fans"
              isSelected={selected === 'fans'}
              to={`/network/euler-5/hero/${address}/fans`}
            />
            <TabBtn
              text="Burden"
              isSelected={selected === 'burden'}
              to={`/network/euler-5/hero/${address}/burden`}
            />
            <TabBtn
              text="Main"
              isSelected={selected === 'main'}
              to={`/network/euler-5/hero/${address}`}
            />
            <TabBtn
              text="Rumors"
              isSelected={selected === 'rumors'}
              to={`/network/euler-5/hero/${address}/rumors`}
            />

            <TabBtn
              text="Leadership"
              isSelected={selected === 'leadership'}
              to={`/network/euler-5/hero/${address}/leadership`}
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
          updateTable={this.update}
          validators={validatorInfo}
          unStake={unStake}
          addressLedger={addressLedger}
        />
      </div>
    );
  }
}

export default ValidatorsDetails;
