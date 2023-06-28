import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import KeyItem from './KeyItem/KeyItem';
import { MainContainer } from 'src/components';
import ActionBar from 'src/containers/Wallet/actionBar';
import { initPocket } from 'src/redux/features/pocket';

function Keys() {
  const { accounts, defaultAccount } = useSelector(
    (state: RootState) => state.pocket
  );

  const dispatch = useDispatch();

  const acc = {
    ...accounts,
  };

  if (defaultAccount) {
    acc[defaultAccount.name] = defaultAccount.account;
  }

  return (
    <>
      <MainContainer>
        {acc
          ? Object.values(acc)
              .filter((account) => account?.cyber)
              .map(({ cyber: account }) => {
                return <KeyItem key={account.bech32} account={account} />;
              })
          : 'No accounts'}
      </MainContainer>

      <ActionBar
        selectCard="pubkey"
        hoverCard="pubkey"
        selectAccount={null}
        updateAddress={() => {
          dispatch(initPocket());
        }}
        defaultAccounts={null}
      />
    </>
  );
}

export default Keys;
