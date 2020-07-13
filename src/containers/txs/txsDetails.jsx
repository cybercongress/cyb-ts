import React from 'react';
import { Text, Pane } from '@cybercongress/gravity';
import { getTxs } from '../../utils/search/utils';
import InformationTxs from './informationTxs';
import { connect } from 'react-redux';
import Msgs from './msgs';
import ActionBarContainer from '../../containers/Search/ActionBarContainer';

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
      },
      messageError: '',
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
    let status = false;

    console.log('txHash', txHash);

    const {
      height,
      txhash,
      tx,
      code,
      raw_log: rawLog,
      timestamp,
    } = await getTxs(txHash);

    if (code !== undefined) {
      if (code !== 0) {
        status = false;
        messageError = rawLog;
      } else {
        status = true;
      }
    } else {
      status = true;
    }

    this.setState({
      txs: tx,
      information: {
        txHash: txhash,
        status,
        height,
        timestamp,
        memo: tx.value.memo,
      },
      messageError,
      msgs: tx.value.msg,
    });
  };

  render() {
    const { information, messageError, msgs } = this.state;
    const { match, mobile } = this.props;
    const { txHash } = match.params;

    return (
      <div>
        <main className="block-body">
          <InformationTxs
            data={information}
            messageError={messageError}
            marginBottom={30}
          />
          {msgs.length > 0 && <Msgs data={msgs} />}
        </main>
        {!mobile && (
        <ActionBarContainer valueSearchInput={txHash} keywordHash={txHash} />
         )}
      </div>
    );
  }
}

const mapStateToProps = store => {
  return {
    mobile: store.settings.mobile,
  };
};

export default connect(mapStateToProps)(TxsDetails);
