/* eslint-disable no-nested-ternary */
import React, { useContext, useEffect, useState, useMemo } from 'react';
import { Tablist, Tab, Pane, Text, ActionBar } from '@cybercongress/gravity';
import { Route, Link, useParams, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import GetLink from './tabs/link';
import { getIpfsHash, getTweet, chekFollow } from '../../utils/search/utils';
// import Balance fro./mainnce';
import Heroes from './tabs/heroes';
import { coinDecimals, formatNumber, asyncForEach } from '../../utils/utils';
import {
  Loading,
  Copy,
  ContainerCard,
  Card,
  Dots,
  NoItems,
} from '../../components';
import ActionBarContainer from './actionBar';
// import GetTxs from './tabs/txs';
import Main from './tabs/main';
import TableDiscipline from '../gol/table';
import FeedsTab from './tabs/feeds';
import FollowsTab from './tabs/follows';
import AvatarIpfs from './component/avatarIpfs';
import CyberLinkCount from './component/cyberLinkCount';
import { AppContext } from '../../context';
import { useGetCommunity, useGetBalance, useGetHeroes } from './hooks';
import { CYBER, PATTERN_CYBER } from '../../utils/config';
import useGetTsxByAddress from './hooks/useGetTsxByAddress';
import TxsTable from './component/txsTable';

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

function AccountDetails({ node, mobile, defaultAccount }) {
  const { jsCyber } = useContext(AppContext);
  const { address } = useParams();
  const location = useLocation();
  const [updateAddress, setUpdateAddress] = useState(0);
  const { community } = useGetCommunity(address, updateAddress);
  const { balance, loadingBalanceInfo, balanceToken } = useGetBalance(
    address,
    updateAddress
  );
  const { staking, totalRewards, loadingHeroesInfo } = useGetHeroes(
    address,
    updateAddress
  );
  const dataGetTsxByAddress = useGetTsxByAddress(address);
  const [selected, setSelected] = useState('log');
  const [dataTweet, setDataTweet] = useState([]);
  const [tweets, setTweets] = useState(false);
  const [loaderTweets, setLoaderTweets] = useState(true);
  const [follow, setFollow] = useState(false);
  const [activeAddress, setActiveAddress] = useState(null);
  const [karmaNeuron, setKarmaNeuron] = useState(0);

  useEffect(() => {
    const { pathname } = location;
    if (
      pathname.match(/timeline/gm) &&
      pathname.match(/timeline/gm).length > 0
    ) {
      setSelected('timeline');
    } else if (
      pathname.match(/sigma/gm) &&
      pathname.match(/sigma/gm).length > 0
    ) {
      setSelected('sigma');
    } else if (
      pathname.match(/security/gm) &&
      pathname.match(/security/gm).length > 0
    ) {
      setSelected('security');
    } else if (
      pathname.match(/badges/gm) &&
      pathname.match(/badges/gm).length > 0
    ) {
      setSelected('badges');
    } else if (
      pathname.match(/cyberlinks/gm) &&
      pathname.match(/cyberlinks/gm).length > 0
    ) {
      setSelected('cyberlinks');
    } else if (
      pathname.match(/swarm/gm) &&
      pathname.match(/swarm/gm).length > 0
    ) {
      setSelected('swarm');
    } else {
      setSelected('log');
    }
  }, [location.pathname]);

  useEffect(() => {
    const getFeeds = async () => {
      let responseTweet = null;
      let dataTweets = [];
      setDataTweet([]);
      setLoaderTweets(true);

      responseTweet = await getTweet(address);
      console.log(`responseTweet`, responseTweet);
      if (responseTweet && responseTweet.txs && responseTweet.total_count > 0) {
        dataTweets = [...dataTweets, ...responseTweet.txs];
      }
      setDataTweet(dataTweets);
      setLoaderTweets(false);
    };
    getFeeds();
  }, [address, updateAddress]);

  useEffect(() => {
    const getKarma = async () => {
      if (jsCyber !== null && address.match(PATTERN_CYBER)) {
        const responseKarma = await jsCyber.karma(address);
        const karma = parseFloat(responseKarma.karma);
        setKarmaNeuron(karma);
      }
    };
    getKarma();
  }, [jsCyber, address]);

  useEffect(() => {
    const chekFollowAddress = async () => {
      const addressFromIpfs = await getIpfsHash(address);
      if (defaultAccount.account !== null && defaultAccount.account.cyber) {
        const response = await chekFollow(
          defaultAccount.account.cyber.bech32,
          addressFromIpfs
        );
        console.log(`response`, response);
        if (
          response !== null &&
          response.total_count > 0 &&
          defaultAccount.account.cyber.bech32 !== address
        ) {
          setFollow(false);
          setTweets(false);
        }
      }
    };
    chekFollowAddress();
  }, [defaultAccount.name, address, updateAddress]);

  useEffect(() => {
    const chekAddress = async () => {
      const { account } = defaultAccount;
      if (
        account !== null &&
        Object.prototype.hasOwnProperty.call(account, 'cyber')
      ) {
        const { keys } = account.cyber;
        if (keys !== 'read-only') {
          if (account.cyber.bech32 === address) {
            setFollow(false);
            setTweets(true);
            setActiveAddress({ ...account.cyber });
          } else {
            setFollow(true);
            setTweets(false);
            setActiveAddress({ ...account.cyber });
          }
        } else {
          setActiveAddress(null);
        }
      } else {
        setActiveAddress(null);
      }
    };
    chekAddress();
  }, [defaultAccount.name, address]);

  let content;
  if (selected === 'security') {
    if (loadingHeroesInfo) {
      content = <Dots />;
    } else {
      content = (
        <Route
          path="/network/bostrom/contract/:address/security"
          render={() => <Heroes data={staking} />}
        />
      );
    }
  }
  // console.log('balance', balance);
  if (selected === 'sigma') {
    if (loadingBalanceInfo) {
      content = <Dots />;
    } else {
      content = <Main balance={balance} balanceToken={balanceToken} />;
    }
  }

  if (selected === 'cyberlinks') {
    content = <GetLink accountUser={address} />;
  }

  if (selected === 'timeline') {
    content = (
      <Route
        path="/network/bostrom/contract/:address/timeline"
        render={() => (
          <TxsTable
            dataGetTsxByAddress={dataGetTsxByAddress}
            accountUser={address}
          />
        )}
      />
    );
  }

  if (selected === 'badges') {
    content = (
      <Route
        path="/network/bostrom/contract/:address/badges"
        render={() => <TableDiscipline address={address} />}
      />
    );
  }

  if (selected === 'log') {
    if (loaderTweets) {
      content = <Dots />;
    } else {
      content = (
        <Route
          path="/network/bostrom/contract/:address"
          render={() => <FeedsTab data={dataTweet} nodeIpfs={node} />}
        />
      );
    }
    // connect = <FeedsTab data={dataTweet} nodeIpfs={node} />;
  }

  if (selected === 'swarm') {
    content = (
      <Route
        path="/network/bostrom/contract/:address/swarm"
        render={() => <FollowsTab node={node} community={community} />}
      />
    );
    // connect = <FollowsTab data={addressFollows} />;
  }

  return (
    <div>
      <main className="block-body">
        {/* <button type="button" onClick={() => setOffset((item) => item + 1)}>
          +
        </button> */}
        <Pane
          marginBottom={20}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Text color="#fff" fontSize="18px">
            {address} <Copy text={address} />
          </Text>
        </Pane>
        <ContainerCard col={3}>
          <Card
            title="Karma"
            value={formatNumber(karmaNeuron)}
            stylesContainer={{
              width: '100%',
              maxWidth: 'unset',
              margin: 0,
            }}
          />
          <AvatarIpfs addressCyber={address} node={node} />
          <Card
            title={`total, ${CYBER.DENOM_CYBER.toUpperCase()}`}
            value={formatNumber(balance.total)}
            stylesContainer={{
              width: '100%',
              maxWidth: 'unset',
              margin: 0,
            }}
          />
        </ContainerCard>
        <Tablist
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(110px, 1fr))"
          gridGap="10px"
        >
          <TabBtn
            text="Security"
            isSelected={selected === 'security'}
            to={`/network/bostrom/contract/${address}/security`}
          />
          <TabBtn
            text="Sigma"
            isSelected={selected === 'sigma'}
            to={`/network/bostrom/contract/${address}/sigma`}
          />
          <TabBtn
            text="Cyberlinks"
            isSelected={selected === 'cyberlinks'}
            to={`/network/bostrom/contract/${address}/cyberlinks`}
          />
          <TabBtn
            text="Log"
            isSelected={selected === 'log'}
            to={`/network/bostrom/contract/${address}`}
          />
          <TabBtn
            text="Swarm"
            isSelected={selected === 'swarm'}
            to={`/network/bostrom/contract/${address}/swarm`}
          />
          <TabBtn
            text="Timeline"
            isSelected={selected === 'timeline'}
            to={`/network/bostrom/contract/${address}/timeline`}
          />
          <TabBtn
            text="Badges"
            isSelected={selected === 'badges'}
            to={`/network/bostrom/contract/${address}/badges`}
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
      {!mobile &&
        (activeAddress !== null ? (
          <ActionBarContainer
            updateAddress={() => setUpdateAddress(updateAddress + 1)}
            addressSend={address}
            type={selected}
            follow={follow}
            tweets={tweets}
            defaultAccount={activeAddress}
            totalRewards={totalRewards}
          />
        ) : (
          <ActionBar>
            <Pane>
              <Link
                style={{
                  paddingTop: 10,
                  paddingBottom: 10,
                  display: 'block',
                }}
                className="btn"
                to="/gol"
              >
                add address to your pocket
              </Link>
            </Pane>
          </ActionBar>
        ))}
    </div>
  );
}

const mapStateToProps = (store) => {
  return {
    mobile: store.settings.mobile,
    node: store.ipfs.ipfs,
    defaultAccount: store.pocket.defaultAccount,
  };
};

export default connect(mapStateToProps)(AccountDetails);
