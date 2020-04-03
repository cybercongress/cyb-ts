import React, { PureComponent } from 'react';

class Status extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      status: 'fail',
    };
  }

  async componentDidMount() {
    const { ipfs } = this.props;
    console.log(ipfs);
    // this.ops();
    if (ipfs !== null) {
      const status = await ipfs.isOnline();
      console.log('status', status);
    }
  }

  render() {
    const { status } = this.state;

    return <div>{status}</div>;
  }
}

export default Status;
