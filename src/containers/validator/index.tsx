import React from 'react';
import { Pane, Text } from '@cybercongress/gravity';
import { connect } from 'react-redux';
import withRouter from 'src/components/helpers/withRouter';

import withDevice from 'src/components/helpers/withDevice';
import ValidatorInfo from './validatorInfo';
import {
  getValidatorsInfo,
  stakingPool,
  selfDelegationShares,
  getDelegators,
} from '../../utils/search/utils';
import { fromBech32, trimString } from '../../utils/utils';
import { Loading, Copy, Tabs } from '../../components';
import Delegated from './delegated';
import Fans from './fans';
import NotFound from '../application/notFound';
import ActionBarContainer from '../Validators/ActionBarContainer';
import Leadership from './leadership';
import Rumors from './rumors';
import { MusicalAddress } from '../portal/components';
import Loader2 from 'src/components/ui/Loader2';

const mapTabs = [
  { key: 'fans', to: 'fans' },
  { key: 'main', to: '' },
  { key: 'rumors', to: 'rumors' },
  { key: 'leadership', to: 'leadership' },
];

class ValidatorsDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      validatorInfo: [],
      // eslint-disable-next-line react/no-unused-state
      data: {},
      delegated: {},
      loader: true,
      error: false,
      fans: [],
      addressPocket: null,
      unStake: false,
    };
  }

  async componentDidMount() {
    await this.checkAddressLocalStorage();
    this.init();
    // this.chekPathname();
  }

  componentDidUpdate(prevProps) {
    const {
      router: {
        location: { pathname },
      },
      defaultAccount,
    } = this.props;
    if (prevProps.router.location.pathname !== pathname) {
      this.init();
    }

    if (prevProps.defaultAccount.name !== defaultAccount.name) {
      this.updateAddressLocalStorage();
    }
  }

  updateAddressLocalStorage = async () => {
    this.setState({ loader: true, unStake: false });
    await this.checkAddressLocalStorage();
    await this.init();
  };

  init = async () => {
    // this.setState({ loader: true });
    await this.getValidatorInfo();
    this.getDelegators();
  };

  checkAddressLocalStorage = async () => {
    const { defaultAccount } = this.props;
    const { account } = defaultAccount;
    if (
      account !== null &&
      Object.prototype.hasOwnProperty.call(account, 'cyber')
    ) {
      this.setState({ addressPocket: account.cyber });
    } else {
      this.setState({
        addressPocket: null,
      });
    }
  };

  update = async () => {
    await this.getValidatorInfo();
    this.getDelegators();
  };

  // eslint-disable-next-line class-methods-use-this
  getSupply = async () => {
    const bondedTokens = await stakingPool();
    return bondedTokens.bonded_tokens;
  };

  // eslint-disable-next-line class-methods-use-this
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
    const {
      router: {
        params: { address },
      },
    } = this.props;

    const resultStakingPool = await this.getSupply();
    const result = await getValidatorsInfo(address);

    if (result === null) {
      return this.setState({ error: true, loader: false });
    }

    const delegateAddress = fromBech32(result.operator_address);

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
    const {
      router: { params },
    } = this.props;
    const { address } = params;
    const { validatorInfo, addressPocket, unStake } = this.state;

    let fans = [];

    const data = await getDelegators(address);

    if (data !== null) {
      fans = data.result;
      // TODO: refactor
      Object.keys(fans).forEach((key) => {
        if (unStake === false) {
          if (addressPocket !== null) {
            if (
              fans[key].delegation.delegator_address === addressPocket.bech32
            ) {
              this.setState({
                unStake: true,
              });
            }
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

  render() {
    const {
      validatorInfo,
      loader,
      delegated,
      fans,
      error,
      addressPocket,
      unStake,
    } = this.state;
    const {
      router: { params },
    } = this.props;

    const { address, tab } = params;

    if (loader) {
      return (
        <div
          style={{
            height: '50vh',
          }}
        >
          <Loader2 />
        </div>
      );
    }

    if (error) {
      return <NotFound />;
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
            <MusicalAddress address={validatorInfo.operator_address} />
          </Pane>
          <ValidatorInfo data={validatorInfo} marginBottom={20} />
          <Tabs
            selected={tab || 'main'}
            options={mapTabs.map((item) => ({
              key: item.key,
              to: `/network/bostrom/hero/${address}/${item.to}`,
            }))}
          />
          <Pane
            display="flex"
            marginTop={20}
            marginBottom={50}
            justifyContent="center"
            flexDirection="column"
          >
            {!tab && <Delegated data={delegated} />}
            {tab === 'fans' && <Fans data={fans} />}
            {tab === 'rumors' && (
              <Rumors accountUser={validatorInfo.operator_address} />
            )}
            {tab === 'leadership' && (
              <Leadership accountUser={validatorInfo.delegateAddress} />
            )}
          </Pane>
        </main>
        <ActionBarContainer
          updateTable={this.update}
          validators={validatorInfo}
          unStake={unStake}
          addressPocket={addressPocket}
        />
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    defaultAccount: store.pocket.defaultAccount,
  };
};

export default connect(mapStateToProps)(
  withDevice(withRouter(ValidatorsDetails))
);
