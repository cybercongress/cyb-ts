import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import KeyItem from './KeyItem/KeyItem';
import { MainContainer } from 'src/components';
import ActionBar from 'src/containers/Wallet/actionBar';
import { initPocket } from 'src/redux/features/pocket';
import styles from './Keys.module.scss';
import { useState } from 'react';

function Keys() {
  const { accounts, defaultAccount } = useSelector(
    (state: RootState) => state.pocket
  );

  const [selectedKey, setSelectedKey] = useState();

  const dispatch = useDispatch();

  function selectKey(address: string) {
    setSelectedKey(selectedKey === address ? null : address);
  }

  const acc = {
    ...accounts,
  };

  if (defaultAccount) {
    acc[defaultAccount.name] = defaultAccount.account;
  }

  const bostromAccounts =
    acc && Object.values(acc).filter((account) => account?.cyber);

  return (
    <>
      <div className={styles.wrapper}>
        {bostromAccounts.length > 0 ? (
          bostromAccounts.map(({ cyber: account }) => {
            return (
              <KeyItem
                key={account.bech32}
                account={account}
                selected={selectedKey === account.bech32}
                selectKey={selectKey}
              />
            );
          })
        ) : (
          <p>
            you have no keys added yet <br />
            add your first key by connecting your wallet
          </p>
        )}
      </div>

      <ActionBar
        selectCard="pubkey"
        hoverCard="pubkey"
        selectAccount={null}
        selectedAddress={selectedKey}
        updateAddress={() => {
          dispatch(initPocket());
        }}
        defaultAccounts={null}
      />
    </>
  );
}

export default Keys;
