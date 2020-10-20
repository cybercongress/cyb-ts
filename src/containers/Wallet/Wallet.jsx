/* eslint-disable no-nested-ternary */
import React from 'react';
import { connect } from 'react-redux';
import { Pane, Text, Tooltip, Icon } from '@cybercongress/gravity';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import Web3Utils from 'web3-utils';
import { Link } from 'react-router-dom';

import { Loading, ConnectLadger, Copy, LinkWindow } from '../../components';
import NotFound from '../application/notFound';
import ActionBarContainer from './actionBarContainer';
import { setBandwidth } from '../../redux/actions/bandwidth';
import withWeb3 from '../../components/web3/withWeb3';
import injectKeplr from '../../components/web3/injectKeplr';

import { LEDGER, COSMOS, PATTERN_CYBER } from '../../utils/config';
import {
  getBalance,
  getTotalEUL,
  getImportLink,
  getAccountBandwidth,
  getGraphQLQuery,
} from '../../utils/search/utils';
import { PocketCard } from './components';
import {
  PubkeyCard,
  GolCard,
  ImportLinkLedger,
  GolBalance,
  TweetCard,
} from './card';
import ActionBarTweet from './actionBarTweet';
import ActionBarConnect from './actionBarConnect';
import ActionBarKeplr from './actionBarKeplr';
import ActionBar from './actionBar';

const { GaiaApi } = require('@chainapsis/cosmosjs/gaia/api');
const { AccAddress } = require('@chainapsis/cosmosjs/common/address');
const { Coin } = require('@chainapsis/cosmosjs/common/coin');
const { MsgSend } = require('@chainapsis/cosmosjs/x/bank');
const {
  defaultBech32Config,
} = require('@chainapsis/cosmosjs/core/bech32Config');

const {
  HDPATH,
  LEDGER_OK,
  LEDGER_NOAPP,
  STAGE_INIT,
  STAGE_LEDGER_INIT,
  STAGE_READY,
  STAGE_ERROR,
  LEDGER_VERSION_REQ,
} = LEDGER;

const QueryAddress = (address) =>
  `
  query MyQuery {
    cyberlink(where: {subject: {_eq: "${address}"}}) {
      object_from
      object_to
    }
  }`;

function flatten(data, outputArray) {
  data.forEach((element) => {
    if (Array.isArray(element)) {
      flatten(element, outputArray);
    } else {
      outputArray.push(element);
    }
  });
}

const comparer = (otherArray) => {
  return (current) => {
    return (
      otherArray.filter((other) => {
        return (
          other.object_from === current.from && other.object_to === current.to
        );
      }).length === 0
    );
  };
};

const groupLink = (linkArr) => {
  const link = [];
  const size = 7;
  for (let i = 0; i < Math.ceil(linkArr.length / size); i += 1) {
    link[i] = linkArr.slice(i * size, i * size + size);
  }
  return link;
};

class Wallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: STAGE_INIT,
      pocket: [],
      refreshTweet: 0,
      accountKeplr: null,
      returnCode: null,
      ledgerVersion: [0, 0, 0],
      selectAccount: null,
      defaultAccounts: null,
      defaultAccountsKeys: null,
      addAddress: false,
      loading: true,
      accounts: null,
      accountsETH: null,
      link: null,
      selectedIndex: '',
      importLinkCli: false,
      linkSelected: null,
      selectCard: '',
      updateCard: 0,
      balanceEthAccount: {
        eth: 0,
        gol: 0,
      },
    };
  }

  async componentDidMount() {
    const { accountKeplr, accounts, web3 } = this.props;

    await this.setState({
      accountsETH: accounts,
    });

    if (accountKeplr && accountKeplr !== null) {
      this.setState({
        accountKeplr,
      });
    }

    if (accounts && accounts !== null) {
      this.getBalanceEth();
    }

    await this.checkAddressLocalStorage();
    if (web3.givenProvider !== null) {
      this.accountsChanged();
    }
  }

  accountsChanged = () => {
    window.ethereum.on('accountsChanged', async (accountsChanged) => {
      const defaultAccounts = accountsChanged[0];
      const tmpAccount = defaultAccounts;
      this.setState({
        accountsETH: tmpAccount,
      });
      this.getBalanceEth();
    });
  };

  getBalanceEth = async () => {
    const { accountsETH } = this.state;
    const { web3, contractToken } = this.props;
    const balanceEthAccount = {
      eth: 0,
      gol: 0,
    };
    console.log(accountsETH);

    if (accountsETH && accountsETH !== null) {
      const responseGol = await contractToken.methods
        .balanceOf(accountsETH)
        .call();
      balanceEthAccount.gol = responseGol;
      const responseEth = await web3.eth.getBalance(accountsETH);
      const eth = Web3Utils.fromWei(responseEth, 'ether');
      balanceEthAccount.eth = eth;
    }

    this.setState({
      balanceEthAccount,
    });
  };

  checkAddressLocalStorage = async () => {
    const { updateCard } = this.state;
    const { setBandwidthProps } = this.props;
    let localStoragePocketAccountData = [];
    let defaultAccounts = null;
    let defaultAccountsKeys = null;

    const localStoragePocketAccount = await localStorage.getItem(
      'pocketAccount'
    );
    const localStoragePocket = await localStorage.getItem('pocket');

    if (localStoragePocket !== null) {
      const localStoragePocketData = JSON.parse(localStoragePocket);
      const keyPocket = Object.keys(localStoragePocketData)[0];
      defaultAccounts = keyPocket;
      defaultAccountsKeys = localStoragePocketData[keyPocket].keys;
    }
    if (localStoragePocketAccount !== null) {
      localStoragePocketAccountData = JSON.parse(localStoragePocketAccount);
      if (localStoragePocket === null) {
        const keys0 = Object.keys(localStoragePocketAccountData)[0];
        localStorage.setItem(
          'pocket',
          JSON.stringify({ [keys0]: localStoragePocketAccountData[keys0] })
        );
        defaultAccounts = keys0;
        defaultAccountsKeys = localStoragePocketAccountData[keys0].keys;
      }
      this.setState({
        accounts: localStoragePocketAccountData,
        link: null,
        selectedIndex: '',
        importLinkCli: false,
        linkSelected: null,
        selectCard: '',
        loading: false,
        addAddress: false,
        defaultAccounts,
        defaultAccountsKeys,
        updateCard: updateCard + 1,
      });
      // this.getLocalStorageLink();
      this.accountBandwidth();
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

  accountBandwidth = async () => {
    const { defaultAccounts } = this.state;
    const { setBandwidthProps } = this.props;

    if (defaultAccounts !== null) {
      const response = await getAccountBandwidth(defaultAccounts);
      if (response !== null) {
        const { remained, max_value: maxValue } = response;
        setBandwidthProps(remained, maxValue);
      }
    }
  };

  getLocalStorageLink = async () => {
    const { accounts } = this.state;
    const localStorageStoryLink = localStorage.getItem('linksImport');
    let linkUser = [];
    const dataLink = await getGraphQLQuery(QueryAddress(accounts.cyber.bech32));

    if (dataLink.cyberlink && dataLink.cyberlink.length > 0) {
      linkUser = dataLink.cyberlink;
    }

    if (localStorageStoryLink === null) {
      this.getLink(linkUser);
    } else {
      const linkData = JSON.parse(localStorageStoryLink);
      if (linkData.length > 0) {
        const flattened = [];

        flatten(linkData, flattened);
        let onlyInB = [];
        if (linkUser.length > 0) {
          onlyInB = flattened.filter(comparer(linkUser));
        }
        if (onlyInB.length > 0) {
          const link = groupLink(onlyInB);
          this.setState({ link });
        } else {
          this.setState({ link: null });
        }
      } else {
        this.setState({ link: null });
      }
    }
  };

  getLink = async (dataLinkUser) => {
    const { accounts } = this.state;
    const dataLink = await getImportLink(accounts.cyber.bech32);
    let link = [];

    if (dataLink !== null) {
      let onlyInB = [];
      if (dataLinkUser.length > 0) {
        onlyInB = dataLink.filter(comparer(dataLinkUser));
      }
      if (onlyInB.length > 0) {
        link = groupLink(onlyInB);
      }

      localStorage.setItem('linksImport', JSON.stringify(link));
      if (link.length > 0) {
        this.setState({
          link,
        });
      } else {
        this.setState({
          link: null,
        });
      }
    }
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

  onClickSelect = (select, key = '') => {
    const { selectCard, accounts } = this.state;
    let selectd = select;
    let selectAccount = null;

    if (key.match(PATTERN_CYBER)) {
      selectAccount = accounts[key];
    }

    if (selectCard === select) {
      selectd = '';
      selectAccount = null;
    }

    this.setState({
      linkSelected: null,
      selectedIndex: '',
      selectCard: selectd,
      selectAccount,
    });
  };

  refreshTweetFunc = () => {
    const { refreshTweet } = this.state;
    this.setState({
      refreshTweet: refreshTweet + 1,
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
      balanceEthAccount,
      accountsETH,
      refreshTweet,
      accountKeplr,
      selectAccount,
      updateCard,
      defaultAccounts,
      defaultAccountsKeys,
    } = this.state;
    const { web3, keplr, stageActionBar } = this.props;

    console.log('addAddress :>> ', addAddress);
    console.log('selectAccount :>> ', selectAccount);

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
              marginX="auto"
              width="60%"
            >
              <Text fontSize="16px" color="#fff">
                This is your pocket. If you give me your pubkey I can help
                cyberlink, track your balances, participate in the{' '}
                <Link to="/gol">Game of Links</Link> and more.
              </Text>
            </Pane>
            <NotFound text=" " />
          </main>
          <ActionBarConnect
            keplr={keplr}
            accountKeplr={accountKeplr}
            updateAddress={this.checkAddressLocalStorage}
          />
        </div>
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
              {defaultAccounts !== null && (
                <TweetCard
                  refresh={refreshTweet}
                  select={selectCard === 'tweet'}
                  onClick={() => this.onClickSelect('tweet')}
                  account={defaultAccounts}
                  marginBottom={20}
                />
              )}

              {Object.keys(accounts).map((key) => (
                <PubkeyCard
                  onClick={() => this.onClickSelect(`pubkey_${key}`, key)}
                  select={selectCard === `pubkey_${key}`}
                  pocket={accounts[key]}
                  marginBottom={20}
                  update={updateCard}
                  defaultAccounts={defaultAccounts === key}
                />
              ))}

              {accountsETH === undefined && web3.givenProvider !== null && (
                <PocketCard
                  marginBottom={20}
                  select={selectCard === 'web3'}
                  onClick={() => this.onClickSelect('web3')}
                >
                  <Text fontSize="16px" color="#fff">
                    Connect ETH account
                  </Text>
                </PocketCard>
              )}

              {accountsETH !== undefined && web3.givenProvider !== null && (
                <GolBalance
                  balance={balanceEthAccount}
                  accounts={accountsETH}
                  pocket={pocket}
                  marginBottom={20}
                  onClick={() => this.onClickSelect('accountsETH')}
                  select={selectCard === 'accountsETH'}
                />
              )}

              <GolCard
                onClick={() => this.onClickSelect('gol')}
                select={selectCard === 'gol'}
                marginBottom={20}
                defaultAccounts={defaultAccounts}
              />
              {link !== null && (
                <PocketCard
                  marginBottom={20}
                  select={selectCard === 'importCli'}
                  onClick={this.onClickImportLink}
                >
                  <Text fontSize="16px" color="#fff">
                    You have created {link !== null && countLink} cyberlinks in
                    euler-5. Import using CLI
                  </Text>
                </PocketCard>
              )}
              {link !== null && pocket.keys === 'ledger' && (
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
          <ActionBar
            selectCard={selectCard}
            selectAccount={selectAccount}
            // actionBar keplr props
            keplr={keplr}
            // actionBar web3
            web3={web3}
            accountsETH={accountsETH}
            // actionBar tweet
            refreshTweet={refreshTweet}
            updateTweetFunc={this.refreshTweetFunc}
            // global props
            updateAddress={this.checkAddressLocalStorage}
            defaultAccounts={defaultAccounts}
            defaultAccountsKeys={defaultAccountsKeys}
          />

          {/* {selectCard === 'tweet' && (
            <ActionBarTweet
              refresh={refreshTweet}
              update={this.refreshTweetFunc}
            />
          )}

          {selectCard !== 'tweet' && (
            <ActionBarContainer
              selectCard={selectCard}
              links={link}
              importLink={importLinkCli}
              // addressTable={accounts.cyber.bech32}
              onClickAddressLedger={this.onClickGetAddressLedger}
              addAddress={addAddress}
              linkSelected={linkSelected}
              selectedIndex={selectedIndex}
              updateAddress={this.checkAddressLocalStorage}
              web3={web3}
              accountsETH={accountsETH}
              // onClickSend={}
            />
          )}
          {selectAccount !== null &&
            selectAccount.keys &&
            selectAccount.keys === 'keplr' && (
              <ActionBarKeplr
                accountKeplr={accountKeplr}
                keplr={keplr}
                selectCard={selectCard}
                updateAddress={this.checkAddressLocalStorage}
              />
            )} */}
        </div>
      );
    }
    return null;
  }
}

const mapDispatchprops = (dispatch) => {
  return {
    setBandwidthProps: (remained, maxValue) =>
      dispatch(setBandwidth(remained, maxValue)),
  };
};

export default connect(null, mapDispatchprops)(withWeb3(injectKeplr(Wallet)));
