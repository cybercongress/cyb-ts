import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import ActionBarContainer from 'src/containers/account/actionBar';

import { RootState } from 'src/redux/store';
import { getIpfsHash, chekFollow } from 'src/utils/search/utils';
import { useRobotContext } from '../Robot';

import { ActionBar } from 'src/components';

function WrappedActionBar() {
  const { defaultAccount } = useSelector((state: RootState) => state.pocket);

  const location = useLocation();
  const tab = location.pathname.split('/')[2] || 'log';

  const { address, refetchData } = useRobotContext();

  const [tweets, setTweets] = useState(false);
  const [follow, setFollow] = useState(false);

  const [activeAddress, setActiveAddress] = useState(null);

  const chekFollowAddress = async () => {
    const addressFromIpfs = await getIpfsHash(address);
    if (defaultAccount.account !== null && defaultAccount.account.cyber) {
      const response = await chekFollow(
        defaultAccount.account.cyber.bech32,
        addressFromIpfs
      );

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

  useEffect(() => {
    chekFollowAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultAccount.name, address]);

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
    <div
      style={{
        left: 0,
        position: 'fixed',
      }}
    >
      {activeAddress !== null ? (
        <ActionBarContainer
          updateAddress={() => {
            refetchData();

            if (follow) {
              chekFollowAddress();
            }
          }}
          addressSend={address}
          type={tab}
          follow={follow}
          tweets={tweets}
          defaultAccount={activeAddress}
        />
      ) : (
        <ActionBar />
      )}
    </div>
  );
}

export default WrappedActionBar;
