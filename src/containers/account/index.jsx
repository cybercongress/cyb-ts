import React from 'react';
import { Tablist, Tab, Pane, Text } from '@cybercongress/gravity';
import { Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import GetLink from './link';
import {
  getBalance,
  getTotalEUL,
  getDistribution,
  getRewards,
  getIpfsHash,
  getAmountATOM,
  getValidatorsInfo,
  getTxCosmos,
  getFollows,
  getContent,
  getTwit,
  chekFollow,
  getIndexStats,
  getGraphQLQuery,
  getAvatar,
} from '../../utils/search/utils';
// import Balance fro./mainnce';
import Heroes from './heroes';
import Unbondings from './unbondings';
import { getDelegator, formatNumber, asyncForEach } from '../../utils/utils';
import { Loading, Copy, ContainerCard, Card } from '../../components';
import ActionBarContainer from './actionBar';
import GetTxs from './txs';
import Main from './main';
import GetMentions from './mentions';
import TableDiscipline from '../gol/table';
import { getEstimation } from '../../utils/fundingMath';
import { setGolTakeOff } from '../../redux/actions/gol';
import FeedsTab from './feeds';
import FollowsTab from './follows';

import { COSMOS, PATTERN_CYBER } from '../../utils/config';

const FileType = require('file-type');
const img = require('../../image/logo-cyb-v3.svg');

const TabBtn = ({ text, isSelected, onSelect, to }) => (
  <Link to={to}>
    <Tab
      key={text}
      isSelected={isSelected}
      onSelect={onSelect}
      paddingX={5}
      paddingY={20}
      marginX={3}
      borderRadius={4}
      color="#36d6ae"
      boxShadow="0px 0px 5px #36d6ae"
      fontSize="16px"
      whiteSpace="nowrap"
      width="100%"
    >
      {text}
    </Tab>
  </Link>
);

const QueryAddress = address =>
  `query cyberlink {
    cyberlink_aggregate(where: {subject: {_eq: "${address}"}}) {
      aggregate {
        count
      }
    }
  }`;

class AccountDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      keywordHash: '',
      loader: true,
      loading: true,
      validatorAddress: null,
      consensusAddress: null,
      addressLedger: null,
      addressFollows: [],
      avatar: null,
      dataTweet: [],
      linksCount: 0,
      follow: true,
      tweets: false,
      takeoffDonations: 0,
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
      selected: 'tweets',
      won: 0,
    };
  }

  componentDidMount() {
    this.init();
  }

  componentDidUpdate(prevProps) {
    const { location, match } = this.props;
    if (prevProps.location.pathname !== location.pathname) {
      this.getBalanseAccount();
      this.chekPathname();
    }
    if (prevProps.match.params.address !== match.params.address) {
      this.init();
    }
  }

  init = async () => {
    this.setState({
      loading: true,
    });
    await this.chekAddress();
    this.chekFollowAddress();
    this.getBalanseAccount();
    this.chekPathname();
    this.getTxsCosmos();
    this.getFollow();
    this.getFeeds();
    this.getAvatarUser();
  };

  getAvatarUser = async () => {
    const { match, node } = this.props;
    const { address: addressProps } = match.params;
    const response = await getAvatar(addressProps);
    if (response !== null && response.txs.length > 0) {
      const cidTo =
        response.txs[response.txs.length - 1].tx.value.msg[0].value.links[0].to;
      const responseDag = await node.dag.get(cidTo, {
        localResolve: false,
      });
      if (responseDag.value.size < 1.5 * 10 ** 6) {
        const responseCat = await node.cat(cidTo);
        const bufs = [];
        bufs.push(responseCat);
        const data = Buffer.concat(bufs);
        const dataFileType = await FileType.fromBuffer(data);
        if (dataFileType !== undefined) {
          const { mime } = dataFileType;
          const dataBase64 = data.toString('base64');
          if (mime.indexOf('image') !== -1) {
            const file = `data:${mime};base64,${dataBase64}`;
            this.setState({
              avatar: file,
            });
          }
        }
      }
      console.log('cidTo >>>', cidTo);
    }
  };

  chekFollowAddress = async () => {
    const { match } = this.props;
    const { address: addressProps } = match.params;
    const { addressLedger } = this.state;
    const address = await getIpfsHash(addressProps);

    if (addressLedger !== null) {
      const response = await chekFollow(addressLedger, address);
      if (response !== null && response.txs.length > 0) {
        this.setState({
          follow: false,
          tweets: false,
        });
      }
    }
  };

  chekAddress = async () => {
    const { location } = this.props;
    const { pathname } = location;
    let address;
    let locationAddress;
    if (
      pathname.match(/cyber[a-zA-Z0-9]{39}/gm) &&
      pathname.match(/cyber[a-zA-Z0-9]{39}/gm).length > 0
    ) {
      locationAddress = pathname.match(/cyber[a-zA-Z0-9]{39}/gm);
    }
    const localStorageStory = localStorage.getItem('ledger');
    if (localStorageStory !== null) {
      address = JSON.parse(localStorageStory);
      console.log('address', address);
      this.setState({ addressLedger: address.bech32 });
    }

    if (address.bech32 === locationAddress[0]) {
      this.setState({
        follow: false,
        tweets: true,
      });
    } else {
      this.setState({
        follow: true,
        tweets: false,
      });
    }
  };

  getFollow = async () => {
    const { match } = this.props;
    const { address } = match.params;
    let responseFollows = null;
    const addressFollows = [];

    if (address) {
      responseFollows = await getFollows(address);
    }

    if (responseFollows !== null && responseFollows.txs) {
      responseFollows.txs.forEach(async item => {
        const cid = item.tx.value.msg[0].value.links[0].to;
        const addressResolve = await getContent(cid);
        console.log('addressResolve :>> ', addressResolve);
        if (addressResolve) {
          const addressFollow = addressResolve;
          console.log('addressResolve :>> ', addressResolve);
          if (addressFollow.match(PATTERN_CYBER)) {
            addressFollows.push(addressFollow);
            this.setState({
              addressFollows,
            });
          }
        }
      });
    }
  };

  getFeeds = async () => {
    const { match } = this.props;
    const { address } = match.params;
    let responseTweet = null;
    let dataTweet = [];

    responseTweet = await getTwit(address);

    if (responseTweet && responseTweet.txs && responseTweet.txs.length > 0) {
      dataTweet = [...dataTweet, ...responseTweet.txs];
    }

    this.setState({
      dataTweet,
    });
  };

  getTxsCosmos = async () => {
    const dataTx = await getTxCosmos();
    console.log(dataTx);
    if (dataTx !== null) {
      this.getAtom(dataTx.txs);
    }
  };

  getAtom = async dataTxs => {
    const { match } = this.props;
    const { address } = match.params;
    const { setGolTakeOffProps } = this.props;
    let amount = 0;

    let estimation = 0;
    let addEstimation = 0;
    const addressCosmos = getDelegator(address, 'cosmos');

    if (dataTxs) {
      for (let item = 0; item < dataTxs.length; item += 1) {
        let temE = 0;
        const addressTx = dataTxs[item].tx.value.msg[0].value.from_address;
        const val =
          Number.parseInt(
            dataTxs[item].tx.value.msg[0].value.amount[0].amount,
            10
          ) / COSMOS.DIVISOR_ATOM;
        temE = getEstimation(estimation, val);
        if (addressTx === addressCosmos) {
          addEstimation += temE;
        }
        amount += val;
        estimation += temE;
      }
    }

    setGolTakeOffProps(
      Math.floor(addEstimation * 10 ** 12),
      Math.floor(estimation * 10 ** 12)
    );

    this.setState({
      loading: false,
      takeoffDonations: amount,
    });
  };

  chekPathname = () => {
    const { location } = this.props;
    const { pathname } = location;

    if (pathname.match(/txs/gm) && pathname.match(/txs/gm).length > 0) {
      this.select('txs');
    } else if (
      pathname.match(/wallet/gm) &&
      pathname.match(/wallet/gm).length > 0
    ) {
      this.select('wallet');
    } else if (
      pathname.match(/heroes/gm) &&
      pathname.match(/heroes/gm).length > 0
    ) {
      this.select('heroes');
    // } else if (
    //   pathname.match(/mentions/gm) &&
    //   pathname.match(/mentions/gm).length > 0
    // ) {
    //   this.select('mentions');
    } else if (pathname.match(/gol/gm) && pathname.match(/gol/gm).length > 0) {
      this.select('gol');
    } else if (
      pathname.match(/cyberlink/gm) &&
      pathname.match(/cyberlink/gm).length > 0
    ) {
      this.select('cyberlink');
    } else if (
      pathname.match(/follows/gm) &&
      pathname.match(/follows/gm).length > 0
    ) {
      this.select('follows');
    } else {
      this.select('tweets');
    }
  };

  getBalanseAccount = async () => {
    const { match } = this.props;
    const { address } = match.params;

    let linksCount = 0;
    let total;
    const staking = {
      delegations: [],
      unbonding: [],
    };

    const keywordHash = await getIpfsHash(address);
    let consensusAddress = null;
    let validatorAddress = null;

    await this.setState({ account: address, keywordHash });

    const result = await getBalance(address);
    console.log('result', result);

    const dataValidatorAddress = getDelegator(address, 'cybervaloper');
    const dataGetValidatorsInfo = await getValidatorsInfo(dataValidatorAddress);

    if (dataGetValidatorsInfo !== null) {
      consensusAddress = dataGetValidatorsInfo.consensus_pubkey;
      validatorAddress = dataValidatorAddress;
    }

    const resultGetDistribution = await getDistribution(dataValidatorAddress);

    const indexStats = await getGraphQLQuery(QueryAddress(address));

    if (indexStats !== null && indexStats.cyberlink_aggregate) {
      linksCount = indexStats.cyberlink_aggregate.aggregate.count;
    }

    if (resultGetDistribution) {
      result.val_commission = resultGetDistribution.val_commission;
    }
    if (result) {
      total = await getTotalEUL(result);
      if (result.delegations && result.delegations.length > 0) {
        staking.delegations = result.delegations;
        staking.delegations = await this.countReward(
          staking.delegations,
          address
        );
      }

      if (result.unbonding && result.unbonding.length > 0) {
        staking.delegations.map((item, index) => {
          return result.unbonding.map(itemUnb => {
            if (item.validator_address === itemUnb.validator_address) {
              staking.delegations[index].entries = itemUnb.entries;
            }
            return staking.delegations[index];
          });
        });
        staking.unbonding = result.unbonding;
      }
    }
    this.setState({
      balance: total,
      validatorAddress,
      consensusAddress,
      staking,
      linksCount,
      loader: false,
    });
  };

  countReward = async (data, address) => {
    const delegations = data;
    await asyncForEach(
      Array.from(Array(delegations.length).keys()),
      async item => {
        let reward = 0;
        const resultRewards = await getRewards(
          address,
          delegations[item].validator_address
        );
        if (resultRewards[0] && resultRewards[0].amount) {
          reward = parseFloat(resultRewards[0].amount);
          delegations[item].reward = Math.floor(reward);
        } else {
          delegations[item].reward = reward;
        }
      }
    );
    return delegations;
  };

  select = selected => {
    this.setState({ selected });
  };

  render() {
    const {
      account,
      balance,
      staking,
      selected,
      loader,
      keywordHash,
      addressLedger,
      validatorAddress,
      consensusAddress,
      won,
      loading,
      takeoffDonations,
      addressFollows,
      dataTweet,
      follow,
      tweets,
      avatar,
      linksCount,
    } = this.state;

    const { node } = this.props;

    let content;

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

    if (loading) {
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

    if (selected === 'heroes') {
      content = (
        <Route
          path="/network/euler/contract/:address/heroes"
          render={() => <Heroes data={staking} />}
        />
      );
    }

    if (selected === 'wallet') {
      content = <Main balance={balance} />;
    }

    if (selected === 'cyberlink') {
      content = <GetLink accountUser={account} />;
    }

    if (selected === 'txs') {
      content = (
        <Route
          path="/network/euler/contract/:address/txs"
          render={() => <GetTxs accountUser={account} />}
        />
      );
    }

    // if (selected === 'mentions') {
    //   content = (
    //     <Route
    //       path="/network/euler/contract/:address/mentions"
    //       render={() => <GetMentions accountUser={keywordHash} />}
    //     />
    //   );
    // }

    if (selected === 'gol') {
      content = (
        <Route
          path="/network/euler/contract/:address/gol"
          render={() => (
            <TableDiscipline
              addressLedger={account}
              validatorAddress={validatorAddress}
              consensusAddress={consensusAddress}
              takeoffDonations={takeoffDonations}
              won={won}
            />
          )}
        />
      );
    }

    if (selected === 'tweets') {
      content = (
        <Route
          path="/network/euler/contract/:address"
          render={() => <FeedsTab data={dataTweet} nodeIpfs={node} />}
        />
      );
      // connect = <FeedsTab data={dataTweet} nodeIpfs={node} />;
    }

    if (selected === 'follows') {
      content = (
        <Route
          path="/network/euler/contract/:address/follows"
          render={() => <FollowsTab data={addressFollows} />}
        />
      );
      // connect = <FollowsTab data={addressFollows} />;
    }

    return (
      <div>
        <main className="block-body">
          <Pane
            marginBottom={20}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Text color="#fff" fontSize="18px">
              {account} <Copy text={account} />
            </Text>
          </Pane>
          <ContainerCard col={3}>
            <Card
              title="cyberlinks"
              value={formatNumber(linksCount)}
              stylesContainer={{
                width: '100%',
                maxWidth: 'unset',
                margin: 0,
              }}
            />
            <img
              style={{
                width: '80px',
                height: '80px',
                borderRadius: avatar !== null ? '50%' : 'none',
              }}
              alt="img-avatar"
              src={avatar !== null ? avatar : img}
            />
            <Card title="total, EUL" value={formatNumber(balance.total)} stylesContainer={{
                width: '100%',
                maxWidth: 'unset',
                margin: 0,
              }} />
          </ContainerCard>
          <Tablist
            display="grid"
            gridTemplateColumns="repeat(auto-fit, minmax(110px, 1fr))"
            gridGap="10px"
          >
            <TabBtn
              text="Heroes"
              isSelected={selected === 'heroes'}
              to={`/network/euler/contract/${account}/heroes`}
            />
            <TabBtn
              text="wallet"
              isSelected={selected === 'Wallet'}
              to={`/network/euler/contract/${account}/wallet`}
            />
            <TabBtn
              text="Cyberlinks"
              isSelected={selected === 'cyberlink'}
              to={`/network/euler/contract/${account}/cyberlink`}
            />
            <TabBtn
              text="Tweets"
              isSelected={selected === 'tweets'}
              to={`/network/euler/contract/${account}`}
            />
            <TabBtn
              text="Follows"
              isSelected={selected === 'follows'}
              to={`/network/euler/contract/${account}/follows`}
            />
            <TabBtn
              text="Txs"
              isSelected={selected === 'txs'}
              to={`/network/euler/contract/${account}/txs`}
            />
            {/* <TabBtn
              text="Mentions"
              isSelected={selected === 'mentions'}
              to={`/network/euler/contract/${account}/mentions`}
            /> */}
            <TabBtn
              text="GoL"
              isSelected={selected === 'gol'}
              to={`/network/euler/contract/${account}/gol`}
            />
          </Tablist>
          <Pane
            display="flex"
            marginTop={20}
            marginBottom={50}
            justifyContent="center"
            flexDirection="column"
          >
            {content}
          </Pane>
        </main>
        <ActionBarContainer
          updateAddress={this.init}
          addressSend={account}
          type={selected}
          addressLedger={addressLedger}
          follow={follow}
          tweets={tweets}
        />
      </div>
    );
  }
}

const mapStateToProps = store => {
  return {
    mobile: store.settings.mobile,
    node: store.ipfs.ipfs,
  };
};

const mapDispatchprops = dispatch => {
  return {
    setGolTakeOffProps: (amount, prize) =>
      dispatch(setGolTakeOff(amount, prize)),
  };
};

export default connect(mapStateToProps, mapDispatchprops)(AccountDetails);
