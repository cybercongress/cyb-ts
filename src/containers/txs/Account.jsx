import React from 'react';
import { getValidatorsInfo } from '../../utils/search/utils';

class Account extends React.Component {
  constructor(props) {
    super(props);
    const { address } = this.props;
    this.state = {
      account: `/account/${address}`,
      moniker: address,
    };
  }

  componentDidMount() {
    const { address } = this.props;
    if (address) {
      if (address.includes('cybervaloper')) {
        this.updateAccount();
      }
    }
  }

  updateAccount = async () => {
    const { address } = this.props;

    const result = await getValidatorsInfo(address);

    if (result) {
      this.setState({
        account: `/validator/${address}`,
        moniker: `${address} (${result.description.moniker})`,
      });
    }
  };

  render() {
    const { moniker, account } = this.state;
    const { children } = this.props;

    return (
      <span>
        <a target="_blank" href={`https://cyberd.ai${account}`}>
          {moniker}
        </a>
        {children}
      </span>
    );
  }
}

export default Account;
