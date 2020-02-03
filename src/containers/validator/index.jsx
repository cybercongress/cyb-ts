import React from 'react';
import ValidatorInfo from './validatorInfo';
import { getValidatorsInfo, stakingPool } from '../../utils/search/utils';
import { getDelegator } from '../../utils/utils';
import { Loading } from '../../components';
import DontReadTheComments from './wss';

class ValidatorsDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      validatorInfo: [],
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
    this.getValidatorInfo();
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (prevProps.location.pathname !== location.pathname) {
      this.getValidatorInfo();
    }
  }

  getSupply = async () => {
    const bondedTokens = await stakingPool();
    return bondedTokens.bonded_tokens;
  };

      // if (result.description.identity !== '') {
    //   fetch(
    //     // `https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=${result.description.identity}&fields=basics`
    //     `https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=${result.description.identity}&fields=pictures`
    //   )
    //     .then(response => response.json())
    //     .then(data => {
    //       if (data.status.code > 0) {
    //         console.log(data);
    //       } else {
    //         console.log(data);
    //       }
    //     });
    // }


  getValidatorInfo = async () => {
    const { match } = this.props;
    const { validators } = match.params;

    this.setState({ loader: true });

    const resultStakingPool = await this.getSupply();

    const result = await getValidatorsInfo(validators);

    const delegateAddress = getDelegator(result.operator_address);

    const votingPower = (result.tokens / resultStakingPool) * 100;

    this.setState({
      validatorInfo: {
        delegateAddress,
        ...result,
        votingPower,
      },
      loader: false,
    });
  };

  render() {
    const { validatorInfo, loader } = this.state;
    // console.log('validatorInfo', validatorInfo);

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
        <ValidatorInfo data={validatorInfo} />
        {/* <DontReadTheComments /> */}
      </main>
    );
  }
}

export default ValidatorsDetails;
