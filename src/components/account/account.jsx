import React from 'react';
import { getValidatorsInfo } from '../../utils/search/utils';
import { formatValidatorAddress } from '../../utils/utils';
import { Link } from '../link/link';

class Account extends React.Component {
  constructor(props) {
    super(props);
    const { address } = this.props;
    this.state = {
      account: `/account/${address}`,
      moniker: address,
      loading: true,
    };
  }

  componentDidMount() {
    const { address } = this.props;
    if (address) {
      if (address.includes('cybervaloper')) {
        this.updateAccount();
      } else {
        this.setState({
          account: `#/account/${address}`,
          moniker: `${formatValidatorAddress(address, 9, 6)}`,
          loading: false,
        });
      }
    }
  }

  updateAccount = async () => {
    const { address } = this.props;

    const result = await getValidatorsInfo(address);

    if (result) {
      this.setState({
        account: `#/validators/${address}`,
        moniker: `${formatValidatorAddress(address, 4, 6)} (${
          result.description.moniker
        })`,
        loading: false,
      });
    }
  };

  render() {
    const { moniker, account, loading } = this.state;
    const { children } = this.props;

    if (loading) {
      return '...';
    }

    return (
      <span>
        <Link to={account}>{moniker}</Link>
        {children}
      </span>
    );
  }
}

export default Account;
