/* eslint-disable no-nested-ternary */
import { useEffect, useState, useMemo } from 'react';
import { Tablist, Pane, Text, ActionBar } from '@cybercongress/gravity';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { useDevice } from 'src/contexts/device';
import { useQueryClient } from 'src/contexts/queryClient';
import GetLink from './tabs/link';
import { getIpfsHash, getTweet, chekFollow } from '../../utils/search/utils';
import Heroes from './tabs/heroes';
import { formatNumber } from '../../utils/utils';
import {
  Copy,
  ContainerCard,
  Card,
  Dots,
  TabBtn,
  ActionBar,
  Account,
} from '../../components';
import ActionBarContainer from './actionBar';
import Main from './tabs/main';
import TableDiscipline from '../gol/table';
import FeedsTab from './tabs/feeds';
import FollowsTab from './tabs/follows';
import { useGetCommunity, useGetBalance, useGetHeroes } from './hooks';
import { CYBER, PATTERN_CYBER } from '../../utils/config';
import useGetTsxByAddress from './hooks/useGetTsxByAddress';
import TxsTable from './component/txsTable';

const getTabsMap = (address) => ({
  security: {
    text: 'Security',
    to: `/network/bostrom/contract/${address}/security`,
  },
  sigma: { text: 'Sigma', to: `/network/bostrom/contract/${address}/sigma` },
  cyberlinks: {
    text: 'Cyberlinks',
    to: `/network/bostrom/contract/${address}/cyberlinks`,
  },
  log: { text: 'Log', to: `/network/bostrom/contract/${address}` },
  swarm: { text: 'Swarm', to: `/network/bostrom/contract/${address}/swarm` },
  timeline: {
    text: 'Timeline',
    to: `/network/bostrom/contract/${address}/timeline`,
  },
  badges: { text: 'Badges', to: `/network/bostrom/contract/${address}/badges` },
});

function AccountDetails({ defaultAccount }) {
  const queryClient = useQueryClient();
  const { address, tab = 'log' } = useParams();
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
  const [dataTweet, setDataTweet] = useState([]);
  const [tweets, setTweets] = useState(false);
  const [loaderTweets, setLoaderTweets] = useState(true);
  const [follow, setFollow] = useState(false);
  const [activeAddress, setActiveAddress] = useState(null);
  const [karmaNeuron, setKarmaNeuron] = useState(0);
  const { isMobile: mobile } = useDevice();

  const tabs = useMemo(() => {
    return getTabsMap(address);
  }, [address]);

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
      if (queryClient && address.match(PATTERN_CYBER)) {
        const responseKarma = await queryClient.karma(address);
        if (responseKarma.karma) {
          setKarmaNeuron(parseFloat(responseKarma.karma));
        }
      }
    };
    getKarma();
  }, [queryClient, address]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultAccount.name, address]);

  const showLoadingDots =
    (loadingHeroesInfo && ['security', 'sigma', ''].indexOf(tab) !== -1) ||
    (loaderTweets && tab === 'log') ||
    (loadingBalanceInfo && tab === 'sigma');
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
          <Account
            address={address}
            avatar
            styleUser={{ flexDirection: 'column' }}
            sizeAvatar="80px"
          />
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
          {Object.entries(tabs).map(([key, item]) => (
            <TabBtn
              key={`acc_tabs_${key}`}
              text={item.text}
              isSelected={tab === key}
              to={item.to}
            />
          ))}
        </Tablist>
        <Pane
          display="flex"
          marginTop={20}
          marginBottom={50}
          justifyContent="center"
          flexDirection="column"
        >
          {showLoadingDots && <Dots />}

          {!showLoadingDots && (
            <>
              {tab === 'security' && <Heroes data={staking} />}
              {tab === 'sigma' && (
                <Main balance={balance} balanceToken={balanceToken} />
              )}
              {tab === 'cyberlinks' && <GetLink accountUser={address} />}

              {tab === 'timeline' && (
                <TxsTable
                  dataGetTsxByAddress={dataGetTsxByAddress}
                  accountUser={address}
                />
              )}
              {tab === 'badges' && <TableDiscipline address={address} />}
              {tab === 'log' && <FeedsTab data={dataTweet} />}
              {tab === 'swarm' && <FollowsTab community={community} />}
            </>
          )}
        </Pane>
      </main>
      {!mobile &&
        (activeAddress !== null ? (
          <ActionBarContainer
            updateAddress={() => setUpdateAddress(updateAddress + 1)}
            addressSend={address}
            type={tab}
            follow={follow}
            tweets={tweets}
            defaultAccount={activeAddress}
            totalRewards={totalRewards}
          />
        ) : (
          <ActionBar />
        ))}
    </div>
  );
}

const mapStateToProps = (store) => {
  return {
    defaultAccount: store.pocket.defaultAccount,
  };
};

export default connect(mapStateToProps)(AccountDetails);
