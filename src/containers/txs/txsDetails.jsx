import React from 'react';
import { Text, Pane } from '@cybercongress/gravity';
import { getTxs } from '../../utils/search/utils';
import InformationTxs from './informationTxs';
import Msgs from './msgs';

const TextTitle = ({ children }) => (
  <Text color="#fff" fontSize="20px">
    {children}
  </Text>
);

class TxsDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      txs: {},
      information: {
        txHash: '',
        height: '',
        status: '',
        timestamp: '',
        memo: '',
        messageError: '',
      },
      msgs: '',
    };
  }

  async componentDidMount() {
    await this.getTxHash();
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (prevProps.location.pathname !== location.pathname) {
      this.getTxHash();
    }
  }

  getTxHash = async () => {
    // const proposals = proposalsIdJson[0].result;
    const { match } = this.props;
    const { txHash } = match.params;
    let messageError = '';

    console.log('txHash', txHash);

    const { height, txhash, tx, logs, timestamp } = await getTxs(txHash);

    if (!logs[0].success) {
      if (logs[0].log.length > 0) {
        const dataLog = JSON.parse(logs[0].log);
        messageError = dataLog.message;
      } else {
        messageError = 'Unknown error';
      }
    }

    this.setState({
      txs: tx,
      information: {
        txHash: txhash,
        status: logs[0].success,
        height,
        timestamp,
        memo: tx.value.memo,
        messageError,
      },
      msgs: tx.value.msg,
    });
  };

  render() {
    const { information, msgs } = this.state;

    return (
      <main className="block-body">
        <InformationTxs data={information} marginBottom={30} />
        {msgs.length > 0 && <Msgs data={msgs} />}
      </main>
    );
  }
}

export default TxsDetails;
