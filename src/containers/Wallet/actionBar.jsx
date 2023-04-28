import { useEffect, useState } from 'react';
import { Pane, ActionBar as ActionBarGravity } from '@cybercongress/gravity';
import { useSigningClient } from 'src/contexts/signerClient';
import ActionBarTweet from './actionBarTweet';
import ActionBarKeplr from './actionBarKeplr';
import ActionBarUser from './actionBarUser';
import ActionBarConnect from './actionBarConnect';
import waitForWeb3 from '../../components/web3/waitForWeb3';
import { NETWORKSIDS } from '../../utils/config';

import imgLedger from '../../image/ledger.svg';
import imgKeplr from '../../image/keplr-icon.svg';
import imgRead from '../../image/duplicate-outline.svg';
import Button from 'src/components/btnGrd';

const STAGE_INIT = 1;
const STAGE_CONNECT = 2;
const STAGE_SEND_LEDGER = 3.1;
const STAGE_SEND_KEPLR = 4.1;
const STAGE_SEND_READ_ONLY = 5.1;

function ButtonImgText({ img, text = 'Send', ...props }) {
  return (
    <Button style={{ margin: '0 10px' }} {...props}>
      {text}{' '}
      <img
        style={{
          width: 20,
          height: 20,
          marginLeft: '5px',
          paddingTop: '2px',
        }}
        src={img}
        alt="img"
      />
    </Button>
  );
}

function ActionBar({
  selectCard,
  selectAccount,
  hoverCard,
  // actionBar web3
  accountsETH,
  // actionBar tweet
  refreshTweet,
  updateTweetFunc,
  // global props
  updateAddress,
  defaultAccounts,
  defaultAccountsKeys,
}) {
  const { signer: keplr } = useSigningClient();
  const [typeActionBar, setTypeActionBar] = useState('');
  const [stage, setStage] = useState(STAGE_INIT);
  const [makeActive, setMakeActive] = useState(false);
  const [connect, setConnect] = useState(false);
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    //
    const getWeb3 = async () => {
      const web3response = await waitForWeb3();
      web3response.eth.net.getId().then((id) => {
        if (id === NETWORKSIDS.main) {
          setWeb3(web3response);
        }
      });
    };
    getWeb3();
  }, []);

  useEffect(() => {
    if (stage === STAGE_INIT) {
      setMakeActive(false);
      setTypeActionBar('');
      switch (true) {
        case selectCard === 'tweet' || hoverCard === 'tweet':
          setTypeActionBar('tweet');
          break;

        case selectCard.indexOf('pubkey') !== -1 ||
          hoverCard.indexOf('pubkey') !== -1:
          changeActionBar(selectAccount);
          break;

        default:
          setTypeActionBar('');
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectCard, hoverCard, selectAccount]);

  useEffect(() => {
    if (defaultAccountsKeys !== null && selectAccount !== null) {
      if (selectAccount.key && defaultAccountsKeys === selectAccount.key) {
        setMakeActive(false);
      } else {
        setMakeActive(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultAccounts, selectAccount]);

  useEffect(() => {
    if (selectAccount !== null) {
      if (selectAccount.cyber && selectAccount.cosmos && selectAccount.eth) {
        setConnect(false);
      } else {
        setConnect(true);
      }
    }
  }, [selectAccount]);

  const changeActionBar = (account) => {
    if (account !== null) {
      if (account.cyber) {
        const { keys } = account.cyber;
        setTypeActionBar(keys);
      } else {
        setTypeActionBar('noCyber');
      }
    }
  };

  const changeDefaultAccounts = async () => {
    if (selectAccount !== null && selectAccount.key) {
      const copy = { ...selectAccount };
      delete copy.key;
      localStorage.setItem(
        'pocket',
        JSON.stringify({ [selectAccount.key]: copy })
      );
    }
    if (updateAddress) {
      updateAddress();
    }
  };

  const onClickDefaultAccountSend = () => {
    if (defaultAccounts !== null && defaultAccounts.cyber) {
      if (defaultAccounts.cyber.keys === 'keplr') {
        setStage(STAGE_SEND_KEPLR);
      }
      if (defaultAccounts.cyber.keys === 'ledger') {
        setStage(STAGE_SEND_LEDGER);
      }
      if (defaultAccounts.cyber.keys === 'read-only') {
        setStage(STAGE_SEND_READ_ONLY);
      }
    }
  };

  const updateFuncActionBar = () => {
    setTypeActionBar('');
    setStage(STAGE_INIT);
    setMakeActive(false);
    setConnect(false);
  };

  const buttonConnect = (
    <Button
      style={{ margin: '0 10px' }}
      onClick={() => setStage(STAGE_CONNECT)}
    >
      Connect
    </Button>
  );

  const buttonActivate = (
    <Button
      style={{ margin: '0 10px' }}
      onClick={() => changeDefaultAccounts()}
    >
      Activate
    </Button>
  );

  if (typeActionBar === '' && stage === STAGE_INIT) {
    return (
      <ActionBarGravity>
        <Pane display="flex">
          {buttonConnect}
          {defaultAccounts !== null && defaultAccounts.cyber && (
            <Button
              style={{ margin: '0 10px' }}
              onClick={() => onClickDefaultAccountSend()}
            >
              Send
            </Button>
          )}
        </Pane>
      </ActionBarGravity>
    );
  }

  if (stage === STAGE_CONNECT) {
    return (
      <ActionBarConnect
        web3={web3}
        accountsETH={accountsETH}
        updateAddress={updateAddress}
        updateFuncActionBar={updateFuncActionBar}
        selectAccount={selectAccount}
      />
    );
  }

  if (typeActionBar === 'noCyber' && stage === STAGE_INIT) {
    return (
      <ActionBarGravity>
        <Pane>
          {connect && buttonConnect}
          {makeActive && buttonActivate}
        </Pane>
      </ActionBarGravity>
    );
  }

  if (typeActionBar === 'keplr' && stage === STAGE_INIT) {
    return (
      <ActionBarGravity>
        <Pane>
          {connect && buttonConnect}
          {keplr && (
            <ButtonImgText
              img={imgKeplr}
              onClick={() => setStage(STAGE_SEND_KEPLR)}
            />
          )}
          {makeActive && buttonActivate}
        </Pane>
      </ActionBarGravity>
    );
  }

  if (typeActionBar === 'ledger' && stage === STAGE_INIT) {
    return (
      <ActionBarGravity>
        <Pane>
          {connect && buttonConnect}
          <ButtonImgText
            img={imgLedger}
            onClick={() => setStage(STAGE_SEND_LEDGER)}
          />
          {makeActive && buttonActivate}
        </Pane>
      </ActionBarGravity>
    );
  }

  if (typeActionBar === 'read-only' && stage === STAGE_INIT) {
    return (
      <ActionBarGravity>
        <Pane>
          {connect && buttonConnect}
          <ButtonImgText
            img={imgRead}
            onClick={() => setStage(STAGE_SEND_READ_ONLY)}
          />
          {makeActive && buttonActivate}
        </Pane>
      </ActionBarGravity>
    );
  }

  if (typeActionBar === 'tweet' && stage === STAGE_INIT) {
    if (defaultAccounts !== null && defaultAccounts.cyber) {
      return (
        <ActionBarTweet
          keplr={keplr}
          refresh={refreshTweet}
          update={updateTweetFunc}
          defaultAccountsKeys={defaultAccounts.cyber.keys}
        />
      );
    }
    return (
      <ActionBarGravity>
        <Pane>Add cyber address to active account</Pane>
      </ActionBarGravity>
    );
  }

  if (stage === STAGE_SEND_KEPLR) {
    return (
      <ActionBarKeplr
        keplr={keplr}
        selectAccount={selectAccount}
        updateAddress={updateFuncActionBar}
        updateBalance={updateAddress}
        onClickBack={() => setStage(STAGE_INIT)}
      />
    );
  }

  if (stage === STAGE_SEND_READ_ONLY) {
    return (
      <ActionBarUser
        selectAccount={selectAccount}
        updateAddress={updateFuncActionBar}
      />
    );
  }

  return null;
}

export default ActionBar;
