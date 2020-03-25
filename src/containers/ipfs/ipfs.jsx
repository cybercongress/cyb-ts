import React, { PureComponent } from 'react';
import getIpfs from 'get-ipfs';
import { connect } from 'react-redux';
import { getContentByCid } from '../../utils/search/utils';

const IPFS = require('ipfs');
const FileType = require('file-type');

const stringToUse1 = 'hello world from webpacked IPFS1';
const stringToUse2 = 'hello world from webpacked IPFS2';

import Status from './status';

class Ipfs extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      agentVersion: null,
      protocolVersion: null,
      addedFileHash: null,
      addedFileContents: null,
      inputAdd1: '',
      inputCup1: '',
      fileType: '',
    };
  }

  // async componentDidMount() {
  //   this.ops();
  // }

  // ops = async () => {
  //   const { node } = this.props;

  //   if (node !== null) {
  //     console.log('node createNode', node);
  //     console.log('IPFS node is ready 1');

  //     const { id, agentVersion, protocolVersion } = await node.id();

  //     const peers = await node.swarm.peers();

  //     console.log('peers', peers);

  //     this.setState({ id, agentVersion, protocolVersion });

  //     const cid = await node.add(new Buffer(stringToUse));
  //     console.log('cid', cid);
  //     this.setState({ addedFileHash: cid[0].hash });
  //     const bufs = [];
  //     const buf = await node.cat(cid[0].hash);
  //     bufs.push(buf);
  //     const data = await Buffer.concat(bufs);
  //     this.setState({ addedFileContents: data.toString('utf8') });
  //   }
  // };

  onClickAdd1 = async () => {
    const { node } = this.props;
    const { inputAdd1 } = this.state;
    const cid = await node.add(new Buffer(inputAdd1));
    console.log('onClickAdd1', cid);
  };

  onClickCut1 = async () => {
    const { node } = this.props;
    const { inputCup1 } = this.state;
    let mime;
    const buf = await node.cat(inputCup1);
    const bufs = [];
    bufs.push(buf);
    const data = await Buffer.concat(bufs);
    const dataFileType = await FileType.fromBuffer(data);
    const dataBase64 = await data.toString('base64');
    console.warn(dataFileType);
    if (dataFileType !== undefined) {
      mime = dataFileType.mime;
    } else {
      mime = 'text/plain';
    }
    const fileType = `data:${mime};base64,${dataBase64}`;
    this.setState({ fileType });
    console.warn('onClickCut1', data.toString('base64'));
  };

  onChangeCut1 = async e => {
    const { value } = e.target;

    await this.setState({
      inputCup1: value,
    });
  };

  onChangeAdd1 = async e => {
    const { value } = e.target;

    await this.setState({
      inputAdd1: value,
    });
  };

  onClickDagGet = async () => {
    const { node } = this.props;
    const { inputCup1 } = this.state;
    const fileType = await getContentByCid(inputCup1, node);
    this.setState({ fileType });
  };

  render() {
    const { inputAdd1, inputCup1, fileType } = this.state;
    return (
      <div style={{ textAlign: 'center' }}>
        {/* <Status ipfs={ipfs} /> */}
        {/* <h1>Everything is working</h1> */}
        <iframe src={fileType} style={{ backgroundColor: '#fff' }} />
        <div>
          <input
            onChange={e => this.onChangeAdd1(e)}
            placeholder="inputAdd1"
            value={inputAdd1}
          />
          <button type="button" onClick={this.onClickAdd1}>
            add1
          </button>
          <input
            onChange={e => this.onChangeCut1(e)}
            placeholder="inputCup1"
            value={inputCup1}
          />
          <button type="button" onClick={this.onClickCut1}>
            cut1
          </button>
          <button type="button" onClick={this.onClickDagGet}>
            dag.get
          </button>
        </div>
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

const mapStateToProps = store => {
  console.log(store);
  return {
    node: store.ipfs.ipfs,
  };
};

export default connect(mapStateToProps)(Ipfs);
