import React, { PureComponent } from 'react';

const IPFS = require('ipfs');

const stringToUse = 'hello world from webpacked IPFS';

class Ipfs extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      agentVersion: null,
      protocolVersion: null,
      addedFileHash: null,
      addedFileContents: null,
    };
  }

  componentDidMount() {
    this.ops();
  }
  // {
  //   repo: String(Math.random() + Date.now()),
  // }

  ops = async () => {
    const node = await IPFS.create({
      repo: String(Math.random() + Date.now()),
      config: { Addresses: { Swarm: [] } },
    });

    console.log('node', node);
    console.log('IPFS node is ready 1');

    const { id, agentVersion, protocolVersion } = await node.id();

    const peers = await node.swarm.peers();

    console.log(peers);

    this.setState({ id, agentVersion, protocolVersion });

    const cid = await node.add(stringToUse);
    console.log('cid', cid);
    this.setState({ addedFileHash: cid[0].hash });
    const bufs = [];
    const buf = await node.cat(cid[0].hash);
    bufs.push(buf);
    const data = await Buffer.concat(bufs);
    this.setState({ addedFileContents: data.toString('utf8') });
  };

  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        {/* <h1>Everything is working</h1> */}
        <p>
          Your ID is <strong>{this.state.id}</strong>
        </p>
        <p>
          Your IPFS version is <strong>{this.state.agentVersion}</strong>
        </p>
        <p>
          Your IPFS protocol version is{' '}
          <strong>{this.state.protocolVersion}</strong>
        </p>
        <hr />
        <div>
          Added a file! <br />
          {this.state.addedFileHash}
        </div>
        <br />
        <br />
        <p>
          Contents of this file: <br />
          {this.state.addedFileContents}
        </p>
      </div>
    );
  }
}

export default Ipfs;
