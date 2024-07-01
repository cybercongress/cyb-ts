import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import KeyItem from './KeyItem/KeyItem';
import { Display, DisplayTitle, MainContainer } from 'src/components';
import ActionBar from 'src/pages/Keys/ActionBar/actionBar';
import { initPocket } from 'src/redux/features/pocket';
import styles from './Keys.module.scss';
import { useState } from 'react';

function Keys() {
  const { accounts } = useSelector((state: RootState) => state.pocket);

  const [selectedKey, setSelectedKey] = useState<string | null>();

  const dispatch = useDispatch();

  function selectKey(address: string) {
    setSelectedKey(selectedKey === address ? null : address);
  }

  const bostromAccounts =
    accounts && Object.values(accounts).filter((account) => account?.cyber);

  return (
    <>
      <Display title={<DisplayTitle title="Keys" />}>
        <div className={styles.wrapper}>
          {bostromAccounts && bostromAccounts.length > 0 ? (
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
      </Display>

      <ActionBar
        selectCard="pubkey"
        hoverCard="pubkey"
        selectAccount={null}
        selectedAddress={selectedKey}
        updateAddress={() => {
          dispatch(initPocket());
          setSelectedKey(null);
        }}
        defaultAccounts={null}
      />
    </>
  );
}

export default Keys;
