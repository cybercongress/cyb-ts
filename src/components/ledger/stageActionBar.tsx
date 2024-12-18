import LocalizedStrings from 'react-localization';
import { Link } from 'react-router-dom';
import { Pane } from '@cybercongress/gravity';
import { useBackend } from 'src/contexts/backend/backend';
import { CHAIN_ID, BASE_DENOM } from 'src/constants/config';
import { KEY_TYPE } from 'src/pages/Keys/types';
import { routes } from 'src/routes';
import { ContainetLedger } from './container';
import { Dots } from '../ui/Dots';
import Account from '../account/account';
import { LinkWindow } from '../link/link';
import { formatNumber, trimString, selectNetworkImg } from '../../utils/utils';

import { i18n } from '../../i18n/en';

import Button from '../btnGrd';
import { InputNumber, Input } from '../Input';
import ActionBar from '../actionBar';
import ButtonIcon from '../buttons/ButtonIcon';
import { Color } from '../LinearGradientContainer/LinearGradientContainer';
import AddFileButton from '../buttons/AddFile/AddFile';

const imgKeplr = require('../../image/keplr-icon.svg');
const imgRead = require('../../image/duplicate-outline.svg');
const imgSecrets = require('../../image/secrets_icon.png');

const T = new LocalizedStrings(i18n);

export function ActionBarContentText({ children, ...props }) {
  return (
    <Pane
      display="flex"
      fontSize="20px"
      justifyContent="center"
      alignItems="center"
      flexGrow={1}
      marginRight="15px"
      {...props}
    >
      {children}
    </Pane>
  );
}

// const toPascalCase = (str) =>
//   str
//     .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[a-zA-Z0-9]+/g)
//     .map((cht) => cht.charAt(0).toUpperCase() + cht.substr(1).toLowerCase())
//     .join('');

export function TransactionSubmitted() {
  return (
    <ActionBar>
      Please wait while we confirm the transaction on the blockchain{' '}
      <Dots big />
    </ActionBar>
  );
}

export function Confirmed({ txHash, txHeight, cosmos, onClickBtnClose }) {
  return (
    <ActionBar button={{ text: 'Fuck Google', onClick: onClickBtnClose }}>
      <span>
        Transaction successful:{' '}
        {cosmos ? (
          <LinkWindow to={`https://www.mintscan.io/txs/${txHash}`}>
            {trimString(txHash, 6, 6)}
          </LinkWindow>
        ) : (
          <Link to={`/network/bostrom/tx/${txHash}`}>
            {trimString(txHash, 6, 6)}
          </Link>
        )}
      </span>
    </ActionBar>
  );
}

export function TransactionError({ onClickBtn, errorMessage }) {
  return (
    <ActionBar
      button={{ text: T.actionBar.confirmedTX.continue, onClick: onClickBtn }}
    >
      Message Error: {errorMessage}
    </ActionBar>
  );
}

export function StartStageSearchActionBar({
  onClickBtn,
  contentHash,
  onChangeInputContentHash,
  showOpenFileDlg,
  inputOpenFileRef,
  onChangeInput,
  onClickClear,
  file,
  searchHash,
  textBtn = 'Cyberlink',
  placeholder = 'add keywords, hash or file',
  keys = 'ledger',
}) {
  const { isIpfsInitialized } = useBackend();
  return (
    // use NodeIsLoadingButton component
    <ActionBar>
      <Pane
        display="flex"
        flexDirection="column"
        position="relative"
        width="80%"
      >
        <Input
          color={Color.Pink}
          value={contentHash}
          disabled={file}
          isTextarea
          // maxRows={20}
          style={{
            paddingLeft: '10px',
            paddingRight: '35px',
            paddingTop: '10px',
            paddingBottom: '10px',
          }}
          onChange={(e) => onChangeInputContentHash(e)}
          placeholder={placeholder}
        />
        <Pane position="absolute" right={10} bottom={10}>
          <input
            ref={inputOpenFileRef}
            onChange={() => onChangeInput(inputOpenFileRef)}
            type="file"
            style={{ display: 'none' }}
          />
          <AddFileButton
            isRemove={file}
            onClick={file ? onClickClear : showOpenFileDlg}
          />
        </Pane>
      </Pane>

      <Button
        disabled={!isIpfsInitialized || !contentHash.length}
        onClick={onClickBtn}
      >
        {!isIpfsInitialized ? (
          <>
            Node is loading&nbsp;
            <Dots />
          </>
        ) : (
          textBtn
        )}
      </Button>

      <Button link={`${routes.studio.path}?cid=${searchHash}`}>
        edit in studio
      </Button>
    </ActionBar>
  );
}

function InputAutoSize({
  value,
  maxValue,
  onChangeInputAmount,
  placeholder,
  autoFocus = true,
}) {
  function isOverflown(element) {
    return element.scrollWidth > element.clientWidth;
  }

  function changefontsize() {
    const myInput = document.getElementById('myInput');
    let currentfontsize = 18;
    if (myInput && myInput !== null) {
      if (isOverflown(myInput)) {
        while (isOverflown(myInput)) {
          currentfontsize -= 1;
          myInput.style.fontSize = `${currentfontsize}px`;
        }
      } else {
        currentfontsize = 18;
        myInput.style.fontSize = `${currentfontsize}px`;
        while (isOverflown(myInput)) {
          currentfontsize -= 1;
          myInput.style.fontSize = `${currentfontsize}px`;
        }
      }
    }
  }

  return (
    <InputNumber
      value={value}
      id="myInput"
      maxValue={maxValue}
      // no such event handler
      // onkeypress={changefontsize()}
      autoFocus={autoFocus}
      onValueChange={onChangeInputAmount}
      placeholder={placeholder}
      width="180px"
    />
  );
}

export function ActionBarSend({
  onClickBtn,
  valueInputAmount,
  valueInputAddressTo,
  onChangeInputAmount,
  onChangeInputAddressTo,
  disabledBtn,
  onClickBack,
}) {
  return (
    <ActionBar
      onClickBack={onClickBack}
      button={{
        text: 'Generate Tx',
        onClick: onClickBtn,
        disabled: disabledBtn,
      }}
    >
      <div style={{ display: 'flex', gap: '30px' }}>
        <Input
          value={valueInputAddressTo}
          width="250px"
          onChange={onChangeInputAddressTo}
          placeholder="recipient"
        />

        <InputAutoSize
          value={valueInputAmount}
          onChangeInputAmount={onChangeInputAmount}
          placeholder="amount"
          autoFocus={false}
        />
      </div>
    </ActionBar>
  );
}

export function RewardsDelegators({
  data,
  onClickBtn,
  onClickBtnClose,
  disabledBtn,
}) {
  console.log('data :>> ', data);
  const itemReward = data.rewards.map((item) => {
    if (item.reward !== null) {
      return (
        <Pane
          key={item.validator_address}
          display="flex"
          justifyContent="space-between"
        >
          <Account address={item.validator_address} />
          <Pane>
            {formatNumber(Math.floor(item.reward[0].amount))}{' '}
            {BASE_DENOM.toUpperCase()}
          </Pane>
        </Pane>
      );
    }
    return undefined;
  });
  return (
    <ContainetLedger onClickBtnClose={onClickBtnClose}>
      <Pane fontSize="20px" marginBottom={20}>
        Total rewards: {formatNumber(Math.floor(data.total[0].amount))}{' '}
        {BASE_DENOM.toUpperCase()}
      </Pane>
      Rewards:
      <Pane marginTop={10} marginBottom={30}>
        <Pane marginBottom={5} display="flex" justifyContent="space-between">
          <Pane>Address</Pane>
          <Pane>Amount</Pane>
        </Pane>
        <Pane>{itemReward}</Pane>
      </Pane>
      <div className="text-align-center">
        <Button disabled={disabledBtn} onClick={onClickBtn}>
          {T.actionBar.send.generate}
        </Button>
      </div>
    </ContainetLedger>
  );
}

export function ConnectAddress({
  selectMethodFunc,
  selectMethod,
  selectNetwork,
  connectAddress,
  keplr,
  onClickBack,
}) {
  return (
    <ActionBar
      button={{
        disabled: !selectNetwork || !selectMethod,
        text: selectMethod === KEY_TYPE.secrets ? 'Add' : 'Connect',
        onClick: connectAddress,
      }}
      onClickBack={onClickBack}
    >
      <Pane display="flex" alignItems="center" justifyContent="center" flex={1}>
        {keplr ? (
          <ButtonIcon
            onClick={() => selectMethodFunc(KEY_TYPE.keplr)}
            active={selectMethod === KEY_TYPE.keplr}
            img={imgKeplr}
            text="keplr"
          />
        ) : (
          <LinkWindow to="https://www.keplr.app/">
            <Pane marginRight={5} width={34} height={30}>
              <img
                style={{ width: '34px', height: '30px' }}
                src={imgKeplr}
                alt="icon"
              />
            </Pane>
          </LinkWindow>
        )}

        <ButtonIcon
          onClick={() => selectMethodFunc(KEY_TYPE.readOnly)}
          active={selectMethod === KEY_TYPE.readOnly}
          img={imgRead}
          text="read-only"
        />
        <ButtonIcon
          onClick={() => selectMethodFunc(KEY_TYPE.secrets)}
          active={selectMethod === KEY_TYPE.secrets}
          img={imgSecrets}
          text="secrets"
        />
      </Pane>
      <span style={{ fontSize: '18px' }}>in</span>
      <Pane display="flex" alignItems="center" justifyContent="center" flex={1}>
        <ButtonIcon
          active={selectNetwork === 'cyber'}
          img={selectNetworkImg(CHAIN_ID)}
          text={CHAIN_ID}
        />
      </Pane>
    </ActionBar>
  );
}
