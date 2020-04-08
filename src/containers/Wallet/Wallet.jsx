import React from 'react';
import { connect } from 'react-redux';
import { Pane, Text, Tooltip, Icon } from '@cybercongress/gravity';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import { Link } from 'react-router-dom';
import LocalizedStrings from 'react-localization';
import { CosmosDelegateTool } from '../../utils/ledger';
import { Loading, ConnectLadger, Copy, LinkWindow } from '../../components';
import NotFound from '../application/notFound';
import ActionBarContainer from './actionBarContainer';
import { setBandwidth } from '../../redux/actions/bandwidth';

import { LEDGER, COSMOS } from '../../utils/config';
import { i18n } from '../../i18n/en';
import {
  getBalance,
  getTotalEUL,
  getImportLink,
  getAccountBandwidth,
} from '../../utils/search/utils';
import { PocketCard } from './components';
import { PubkeyCard, GolCard, ImportLinkLedger } from './card';

const T = new LocalizedStrings(i18n);

const {
  HDPATH,
  LEDGER_OK,
  LEDGER_NOAPP,
  STAGE_INIT,
  STAGE_LEDGER_INIT,
  STAGE_READY,
  LEDGER_VERSION_REQ,
} = LEDGER;

class Wallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: STAGE_INIT,
      pocket: [],
      ledger: null,
      returnCode: null,
      addressInfo: null,
      addressLedger: null,
      ledgerVersion: [0, 0, 0],
      time: 0,
      addAddress: false,
      loading: true,
      accounts: null,
      link: null,
      selectedIndex: '',
      importLinkCli: false,
      linkSelected: null,
      selectCard: '',
    };
  }

  async componentDidMount() {
    await this.checkAddressLocalStorage();
  }

  componentDidUpdate() {
    const {
      ledger,
      stage,
      returnCode,
      addressLedger,
      addressInfo,
    } = this.state;

    if (stage === STAGE_LEDGER_INIT) {
      if (ledger === null) {
        this.pollLedger();
      }
      if (ledger !== null) {
        switch (returnCode) {
          case LEDGER_OK:
            if (addressLedger === null) {
              this.getAddress();
            }
            if (addressLedger !== null && addressInfo === null) {
              this.getAddressInfo();
            }
            break;
          default:
            console.log('getVersion');
            this.getVersion();
            break;
        }
      } else {
        // eslint-disable-next-line
        console.warn('Still looking for a Ledger device.');
      }
    }
  }

  compareVersion = async () => {
    const test = this.state.ledgerVersion;
    const target = LEDGER_VERSION_REQ;
    const testInt = 10000 * test[0] + 100 * test[1] + test[2];
    const targetInt = 10000 * target[0] + 100 * target[1] + target[2];
    return testInt >= targetInt;
  };

  checkAddressLocalStorage = async () => {
    const { setBandwidthProps } = this.props;
    let address = [];

    const localStorageStory = await localStorage.getItem('pocket');
    if (localStorageStory !== null) {
      address = JSON.parse(localStorageStory);
      console.log('address', address);
      this.setState({
        accounts: address,
        link: null,
        selectedIndex: '',
        importLinkCli: false,
        linkSelected: null,
        selectCard: '',
      });
      this.getLocalStorageLink();
      this.getAddressInfo();
    } else {
      setBandwidthProps(0, 0);

      this.setState({
        addAddress: true,
        stage: STAGE_INIT,
        loading: false,
        pocket: [],
        ledger: null,
        returnCode: null,
        addressInfo: null,
        addressLedger: null,
        ledgerVersion: [0, 0, 0],
        time: 0,
        accounts: null,
        link: null,
        selectedIndex: '',
        importLinkCli: false,
        linkSelected: null,
        selectCard: '',
      });
    }
  };

  getLocalStorageLink = () => {
    const localStorageStoryLink = localStorage.getItem('linksImport');

    if (localStorageStoryLink === null) {
      this.getLink();
    } else {
      const link = JSON.parse(localStorageStoryLink);
      if (Object.keys(link).length > 0) {
        this.setState({ link });
      } else {
        this.setState({ link: null });
      }
    }
  };

  getLink = async () => {
    const { accounts } = this.state;
    const dataLink = await getImportLink(accounts.cyber.bech32);
    const link = [];

    if (dataLink !== null) {
      const size = 7;
      for (let i = 0; i < Math.ceil(dataLink.length / size); i += 1) {
        link[i] = dataLink.slice(i * size, i * size + size);
      }

      console.log(link);

      localStorage.setItem('linksImport', JSON.stringify(link));
      this.setState({
        link,
      });
    }
  };

  pollLedger = async () => {
    const transport = await TransportU2F.create();
    this.setState({ ledger: new CosmosDelegateTool(transport) });
  };

  getVersion = async () => {
    const { ledger, returnCode } = this.state;
    try {
      const connect = await ledger.connect();
      if (returnCode === null || connect.return_code !== returnCode) {
        this.setState({
          address: null,
          returnCode: connect.return_code,
          ledgerVersion: [connect.major, connect.minor, connect.patch],
          errorMessage: null,
        });
        // eslint-disable-next-line

        console.warn('Ledger app return_code', this.state.returnCode);
      } else {
        this.setState({ time: Date.now() }); // cause componentWillUpdate to call again.
      }
    } catch ({ message, statusCode }) {
      // eslint-disable-next-line
      // eslint-disable-next-line
      console.error('Problem with Ledger communication', message, statusCode);
    }
  };

  getAddress = async () => {
    try {
      const { ledger } = this.state;
      const accounts = {};

      const addressLedgerCyber = await ledger.retrieveAddressCyber(HDPATH);
      const addressLedgerCosmos = await ledger.retrieveAddress(HDPATH);

      accounts.cyber = addressLedgerCyber;
      accounts.cosmos = addressLedgerCosmos;

      console.log('address', addressLedgerCyber);

      this.setState({
        addressLedger: addressLedgerCyber,
        accounts,
      });

      localStorage.setItem('ledger', JSON.stringify(addressLedgerCyber));
      localStorage.setItem('pocket', JSON.stringify(accounts));
      this.getLocalStorageLink();
    } catch (error) {
      const { message, statusCode } = error;
      if (message !== "Cannot read property 'length' of undefined") {
        // this just means we haven't found the device yet...
        // eslint-disable-next-line
        console.error('Problem reading address data', message, statusCode);
      }
      this.setState({ time: Date.now() }); // cause componentWillUpdate to call again.
    }
  };

  getAddressInfo = async () => {
    const { accounts } = this.state;
    const { setBandwidthProps } = this.props;

    const pocket = {};
    const addressInfo = {
      address: '',
      amount: '',
      token: '',
      keys: '',
    };
    const responseCyber = await getBalance(accounts.cyber.bech32);
    const responseBandwidth = await getAccountBandwidth(accounts.cyber.bech32);
    const responseCosmos = await getBalance(
      accounts.cosmos.bech32,
      COSMOS.GAIA_NODE_URL_LSD
    );

    if (responseBandwidth !== null) {
      const { remained, max_value: maxValue } = responseBandwidth;
      setBandwidthProps(remained, maxValue);
    }

    const totalCyber = await getTotalEUL(responseCyber);
    pocket.cyber = {
      address: accounts.cyber.bech32,
      amount: totalCyber.total,
      token: 'eul',
    };
    const totalCosmos = await getTotalEUL(responseCosmos);
    pocket.cosmos = {
      address: accounts.cosmos.bech32,
      amount: totalCosmos.total / COSMOS.DIVISOR_ATOM,
      token: 'atom',
      keys: 'ledger',
    };

    pocket.pk = accounts.cyber.pk;

    console.log(pocket);

    this.setState({
      pocket,
      stage: STAGE_READY,
      addAddress: false,
      loading: false,
      addressInfo,
    });
  };

  cleatState = () => {
    this.setState({
      stage: STAGE_INIT,
      table: [],
      ledger: null,
      returnCode: null,
      addressInfo: null,
      addressLedger: null,
      ledgerVersion: [0, 0, 0],
      time: 0,
      addAddress: true,
    });
  };

  onClickGetAddressLedger = () => {
    this.setState({
      stage: STAGE_LEDGER_INIT,
    });
  };

  onClickImportLink = () => {
    const { importLinkCli, selectCard } = this.state;
    let select = 'importCli';

    if (selectCard === 'importCli') {
      select = '';
    }

    this.setState({
      linkSelected: null,
      selectedIndex: '',
      selectCard: select,
      importLinkCli: !importLinkCli,
    });
  };

  selectLink = (link, index) => {
    const { linkSelected, selectedIndex } = this.state;

    let selectLink = null;

    this.setState({
      importLinkCli: false,
    });

    if (selectedIndex === index) {
      this.setState({
        selectedIndex: '',
        selectCard: '',
      });
    } else {
      this.setState({
        selectedIndex: index,
        selectCard: 'importLedger',
      });
    }

    if (linkSelected !== link) {
      selectLink = link;
      return this.setState({
        linkSelected: selectLink,
      });
    }
    return this.setState({
      linkSelected: selectLink,
    });
  };

  onClickCardPubKey = () => {
    const { selectCard } = this.state;
    let select = 'pubkey';

    if (selectCard === select) {
      select = '';
    }

    this.setState({
      linkSelected: null,
      selectedIndex: '',
      selectCard: select,
    });
  };

  onClickCardGol = () => {
    const { selectCard } = this.state;
    let select = 'gol';

    if (selectCard === select) {
      select = '';
    }

    this.setState({
      linkSelected: null,
      selectedIndex: '',
      selectCard: select,
    });
  };

  render() {
    const {
      pocket,
      loading,
      addAddress,
      stage,
      returnCode,
      ledgerVersion,
      accounts,
      link,
      importLinkCli,
      selectedIndex,
      linkSelected,
      selectCard,
    } = this.state;

    let countLink = 0;
    if (link !== null) {
      countLink = [].concat.apply([], link).length;
    }

    if (loading) {
      return (
        <div
          style={{
            width: '100%',
            height: '50vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Loading />
        </div>
      );
    }

    if (addAddress && stage === STAGE_INIT) {
      return (
        <div>
          <main className="block-body-home">
            <Pane
              boxShadow="0px 0px 5px #36d6ae"
              paddingX={20}
              paddingY={20}
              marginY={20}
            >
              <Text fontSize="16px" color="#fff">
                This is your pocket. If you put you pubkey here I can help
                cyberlink, track your balances, participate in{' '}
                <Link to="/gol">Game of Links</Link> and more.
              </Text>
            </Pane>
            <NotFound text={T.pocket.hurry} />
          </main>
          <ActionBarContainer
            // address={addressLedger.bech32}
            onClickAddressLedger={this.onClickGetAddressLedger}
            addAddress={addAddress}
          />
        </div>
      );
    }

    if (stage === STAGE_LEDGER_INIT) {
      return (
        <ConnectLadger
          pin={returnCode >= LEDGER_NOAPP}
          app={returnCode === LEDGER_OK}
          onClickBtnCloce={this.cleatState}
          version={
            returnCode === LEDGER_OK &&
            this.compareVersion(ledgerVersion, LEDGER_VERSION_REQ)
          }
        />
      );
    }

    if (!addAddress) {
      return (
        <div>
          <main
            style={{ minHeight: 'calc(100vh - 162px)', alignItems: 'center' }}
            className="block-body"
          >
            <Pane
              width="60%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              height="100%"
            >
              <PubkeyCard
                onClick={this.onClickCardPubKey}
                select={selectCard === 'pubkey'}
                pocket={pocket}
              />
              <GolCard
                onClick={this.onClickCardGol}
                select={selectCard === 'gol'}
                marginY={20}
              />
              {link !== null && (
                <PocketCard
                  marginBottom={20}
                  select={selectCard === 'importCli'}
                  onClick={this.onClickImportLink}
                >
                  <Text fontSize="16px" color="#fff">
                    You created {link !== null && countLink} cyberlinks in
                    euler-5. Import CLI
                  </Text>
                </PocketCard>
              )}
              {link !== null && (
                <ImportLinkLedger
                  link={link}
                  countLink={countLink}
                  select={selectCard === 'importLedger'}
                  selectedIndex={selectedIndex}
                  selectLink={this.selectLink}
                />
              )}
            </Pane>
          </main>
          <ActionBarContainer
            selectCard={selectCard}
            links={link}
            importLink={importLinkCli}
            addressTable={accounts.cyber.bech32}
            onClickAddressLedger={this.onClickGetAddressLedger}
            addAddress={addAddress}
            linkSelected={linkSelected}
            selectedIndex={selectedIndex}
            updateAddress={this.checkAddressLocalStorage}
            // onClickSend={}
          />
        </div>
      );
    }
    return null;
  }
}

const mapDispatchprops = dispatch => {
  return {
    setBandwidthProps: (remained, maxValue) =>
      dispatch(setBandwidth(remained, maxValue)),
  };
};

export default connect(null, mapDispatchprops)(Wallet);
