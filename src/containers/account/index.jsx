/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { useDevice } from 'src/contexts/device';
import { useQueryClient } from 'src/contexts/queryClient';
import { getIpfsHash, chekFollow } from '../../utils/search/utils';
import { ActionBar } from '../../components';
import ActionBarContainer from './actionBar';
import { useGetBalance, useGetHeroes } from './hooks';
import { PATTERN_CYBER } from '../../utils/config';

// DELETE:
function AccountDetails({ defaultAccount }) {
  const queryClient = useQueryClient();
  const { address, tab = 'log' } = useParams();
  const [updateAddress, setUpdateAddress] = useState(0);
  const { balance, loadingBalanceInfo } = useGetBalance(address, updateAddress);
  const { totalRewards, loadingHeroesInfo } = useGetHeroes(
    address,
    updateAddress
  );

  const [tweets, setTweets] = useState(false);
  const [follow, setFollow] = useState(false);
  const [activeAddress, setActiveAddress] = useState(null);
  const [karmaNeuron, setKarmaNeuron] = useState(0);
  const { isMobile: mobile } = useDevice();

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

  return (
    <div>
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

export default AccountDetails;
