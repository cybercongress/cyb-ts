import React from 'react';
import { Tablist, Tab, Pane } from '@cybercongress/gravity';
import { Route, Link } from 'react-router-dom';
import ValidatorInfo from './validatorInfo';
import {
  getValidatorsInfo,
  stakingPool,
  selfDelegationShares,
  getDelegations,
} from '../../utils/search/utils';
import { getDelegator } from '../../utils/utils';
import { Loading } from '../../components';
import DontReadTheComments from './wss';
import Delegated from './delegated';
import Delegators from './delegators';
import NotFound from '../application/notFound';
import ActionBarContainer from '../Validators/ActionBarContainer';
import GetTxs from '../account/txs';

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
class ValidatorsDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selected: 'delegated',
      validatorInfo: [],
      data: {},
      delegated: {},
      loader: true,
      error: false,
      delegators: [],
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

  chekPathname = () => {
    const { location } = this.props;
    const { pathname } = location;

    if (pathname.match(/txs/gm) && pathname.match(/txs/gm).length > 0) {
      this.select('txs');
    } else if (
      pathname.match(/delegators/gm) &&
      pathname.match(/delegators/gm).length > 0
    ) {
      this.select('delegators');
    } else {
      this.select('delegated');
    }
  };

  init = async () => {
    // this.setState({ loader: true });
    this.getValidatorInfo();
    this.getDelegators();
  };

  update = async () => {
    this.getValidatorInfo();
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
    const { validators } = match.params;

    const resultStakingPool = await this.getSupply();
    const result = await getValidatorsInfo(validators);

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
        jailed: result.jailed,
        unbondingTime: result.unbonding_time,
        unbondingHeight: result.unbonding_height,
        delegatorShares: result.delegator_shares,
        ...delegated,
      },
      loader: false,
    });
  };

  getDelegators = async () => {
    const { match } = this.props;
    const { validators } = match.params;

    const data = await getDelegations(validators);

    if (data !== null) {
      this.setState({
        delegators: data.result,
      });
    }
  };

  select = selected => {
    this.setState({ selected });
  };

  render() {
    const {
      validatorInfo,
      loader,
      delegated,
      delegators,
      error,
      selected,
      data,
    } = this.state;
    const { match } = this.props;
    const { validators } = match.params;
    // console.log('validatorInfo', validatorInfo);
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

    if (selected === 'delegated') {
      content = <Delegated data={delegated} />;
    }

    if (selected === 'delegators') {
      content = (
        <Route
          path="/validators/:validators/delegators"
          render={() => <Delegators data={delegators} />}
        />
      );
    }

    if (selected === 'txs') {
      content = (
        <Route
          path="/validators/:validators/txs"
          render={() => <GetTxs accountUser={validatorInfo.delegateAddress} />}
        />
      );
    }

    return (
      <div>
        <main className="block-body">
          <ValidatorInfo data={validatorInfo} marginBottom={20} />
          <Tablist display="flex" justifyContent="center">
            <TabBtn
              text="Delegated"
              isSelected={selected === 'delegated'}
              to={`/validators/${validators}`}
            />
            <TabBtn
              text="Delegators"
              isSelected={selected === 'delegators'}
              to={`/validators/${validators}/delegators`}
            />
            <TabBtn
              text="Txs"
              isSelected={selected === 'txs'}
              to={`/validators/${validators}/txs`}
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
        />
      </div>
    );
  }
}

export default ValidatorsDetails;
