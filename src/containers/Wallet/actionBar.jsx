import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Pane,
  ActionBar as ActionBarGravity,
  Button,
} from '@cybercongress/gravity';
import ActionBarTweet from './actionBarTweet';
import ActionBarKeplr from './actionBarKeplr';
import ActionBarWeb3 from './actionBarWeb3';
import ActionBarUser from './actionBarUser';
import ActionBarLedger from './actionBarLedger';
import ActionBarConnect from './actionBarConnect';

function ActionBar({
  selectCard,
  selectAccount,
  // actionBar keplr props
  keplr,
  // actionBar web3
  web3,
  accountsETH,
  // actionBar tweet
  refreshTweet,
  updateTweetFunc,
  // global props
  updateAddress,
  defaultAccounts,
  defaultAccountsKeys,
}) {
  const [typeActionBar, setTypeActionBar] = useState('');

  useEffect(() => {
    switch (true) {
      case selectCard === 'tweet':
        setTypeActionBar('tweet');
        break;
      case selectCard === 'web3':
        setTypeActionBar('web3');
        break;

      case selectCard.indexOf('pubkey') !== -1:
        setTypeActionBar('');
        break;

      case selectCard === 'gol':
        setTypeActionBar('gol');
        break;

      default:
        setTypeActionBar('');
        break;
    }
  }, [selectCard]);

  // if (typeActionBar === '') {
  //   return (
  //     <ActionBarGravity>
  //       <Button>Connect</Button>
  //       <Button>Send</Button>
  //     </ActionBarGravity>
  //   );
  // }

  if (typeActionBar === '') {
    return (
      <ActionBarConnect
        web3={web3}
        accountsETH={accountsETH}
        keplr={keplr}
        updateAddress={updateAddress}
        selectAccount={selectAccount}
      />
    );
  }

  if (typeActionBar === 'gol') {
    return (
      <ActionBarGravity>
        <Pane>
          <Link
            style={{ paddingTop: 10, paddingBottom: 10, display: 'block' }}
            className="btn"
            to="/gol"
          >
            Play Game of Links
          </Link>
        </Pane>
      </ActionBarGravity>
    );
  }

  if (typeActionBar === 'web3') {
    return <ActionBarWeb3 web3={web3} accountsETH={accountsETH} />;
  }

  if (typeActionBar === 'tweet') {
    return (
      <ActionBarTweet
        keplr={keplr}
        refresh={refreshTweet}
        update={updateTweetFunc}
        defaultAccountsKeys={defaultAccountsKeys}
      />
    );
  }

  if (typeActionBar === 'keplr') {
    return (
      <ActionBarKeplr
        keplr={keplr}
        selectAccount={selectAccount}
        updateAddress={updateAddress}
        defaultAccounts={
          selectAccount !== null
            ? defaultAccounts === selectAccount.cyber.bech32
            : false
        }
      />
    );
  }

  if (typeActionBar === 'ledger') {
    return (
      <ActionBarLedger
        selectAccount={selectAccount}
        updateAddress={updateAddress}
        defaultAccounts={
          selectAccount !== null
            ? defaultAccounts === selectAccount.cyber.bech32
            : false
        }
      />
    );
    // return <div />;u
  }

  if (typeActionBar === 'user') {
    return (
      <ActionBarUser
        selectAccount={selectAccount}
        updateAddress={updateAddress}
        defaultAccounts={
          selectAccount !== null
            ? defaultAccounts === selectAccount.cyber.bech32
            : false
        }
      />
    );
  }

  return null;
}

export default ActionBar;
