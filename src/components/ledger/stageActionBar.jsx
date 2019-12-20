import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import LocalizedStrings from 'react-localization';
import { ActionBar, Button, Input, Pane, Text } from '@cybercongress/gravity';
import { ContainetLedger, Loading, FormatNumber } from '../index';
import { formatNumber } from '../../utils/search/utils';

import { i18n } from '../../i18n/en';

import { CYBER } from '../../utils/config';

const { DENOM_CYBER, DENOM_CYBER_G, DIVISOR_CYBER_G } = CYBER;

const T = new LocalizedStrings(i18n);

export const ActionBarContentText = ({ children, ...props }) => (
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

export const JsonTransaction = ({ txMsg, onClickBtnCloce }) => (
  <ContainetLedger onClickBtnCloce={onClickBtnCloce}>
    <div className="text-align-center">
      <h3 style={{ marginBottom: 20 }}>{T.actionBar.jsonTX.pleaseConfirm}</h3>
    </div>

    <div className="container-json">
      <SyntaxHighlighter language="json" style={docco}>
        {JSON.stringify(txMsg, null, 2)}
      </SyntaxHighlighter>
    </div>
  </ContainetLedger>
);

export const TransactionSubmitted = ({ onClickBtnCloce }) => (
  <ContainetLedger onClickBtnCloce={onClickBtnCloce}>
    <span className="font-size-20 display-inline-block text-align-center">
      {T.actionBar.tXSubmitted.tXSubmitted}
    </span>
    <div
      style={{
        marginTop: '35px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <span
        style={{
          marginBottom: '20px',
          maxWidth: '70%',
          fontSize: '16px',
        }}
      >
        {T.actionBar.tXSubmitted.confirmTX}
      </span>
      <Loading />
    </div>
  </ContainetLedger>
);

export const Confirmed = ({
  txHash,
  txHeight,
  onClickBtn,
  onClickBtnCloce,
}) => (
  <ContainetLedger onClickBtnCloce={onClickBtnCloce}>
    <span className="font-size-20 display-inline-block text-align-center">
      {T.actionBar.confirmedTX.confirmed}
    </span>
    <div
      style={{ marginTop: '25px' }}
      className="display-flex flex-direction-column"
    >
      <p style={{ marginBottom: 20, textAlign: 'center' }}>
        {T.actionBar.confirmedTX.blockTX}{' '}
        <span
          style={{
            color: '#3ab793',
            marginLeft: '5px',
          }}
        >
          {formatNumber(txHeight)}
        </span>
      </p>

      <a
        target="_blank"
        rel="noopener noreferrer"
        className="btn"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0 auto',
        }}
        href={`https://cyberd.ai/transactions/${txHash}`}
      >
        {T.actionBar.confirmedTX.viewTX}
      </a>
      <div style={{ marginTop: '25px' }}>
        <span>{T.actionBar.confirmedTX.tXHash}</span>
        <span
          style={{
            fontSize: '12px',
            color: '#3ab793',
            marginLeft: '5px',
          }}
        >
          {txHash}
        </span>
      </div>

      <div style={{ marginTop: '25px', textAlign: 'center' }}>
        <button type="button" className="btn" onClick={onClickBtn}>
          {T.actionBar.confirmedTX.continue}
        </button>
      </div>
    </div>
  </ContainetLedger>
);

export const NoResultState = ({ onClickBtn, valueSearchInput }) => (
  <ActionBar>
    <ActionBarContentText>
      <Text fontSize="18px" color="#fff">
        You are the first one who are searching for{' '}
        <Text fontSize="18px" color="#fff" fontWeight={600}>
          {valueSearchInput}
        </Text>
      </Text>
    </ActionBarContentText>
    <Button onClick={onClickBtn}>Link it using Ledger</Button>
  </ActionBar>
);

export const StartState = ({ targetColor, valueSearchInput, onClickBtn }) => (
  <ActionBar>
    <Pane
      position="absolute"
      bottom={0}
      left="50%"
      marginRight="-50%"
      transform="translate(-50%, -50%)"
    >
      <button
        className="btn-home"
        type="button"
        onClick={onClickBtn}
        style={{
          backgroundColor: `${targetColor ? '#3ab793' : '#000'}`,
          color: `${targetColor ? '#fff' : '#3ab793'}`,
          opacity: `${valueSearchInput.length !== 0 ? 1 : 0}`,
        }}
      >
        {T.actionBar.home.btn}
      </button>

      <a
        style={{
          fontSize: '60px',
          transition: '0.4s',
          display: `${valueSearchInput.length === 0 ? 'block' : 'none'}`,
          opacity: `${valueSearchInput.length === 0 ? 1 : 0}`,
          position: 'absolute',
          transform: 'translate(-50%, -50%)',
          marginRight: '-50%',
          left: '50%',
          bottom: '0px',
          height: '42px',
        }}
        href="https://cybercongress.ai"
        target="_blank"
      >
        ~
      </a>
    </Pane>
  </ActionBar>
);

export const ConnectLadger = ({ pin, app, version, onClickBtnCloce }) => (
  <ContainetLedger onClickBtnCloce={onClickBtnCloce}>
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        fontSize: '25px',
      }}
    >
      <span className="display-inline-block margin-bottom-10px">
        {T.actionBar.connectLadger.getStarted}
      </span>
    </div>
    <div className="display-flex flex-direction-column margin-bottom-10px">
      <div className="display-flex align-items-center margin-bottom-10px">
        <div className={`checkbox ${pin ? 'checked' : ''} margin-right-5px`} />
        <span className="font-size-20 display-inline-block">
          {T.actionBar.connectLadger.connect}
        </span>
      </div>

      <div className="display-flex align-items-center margin-bottom-10px">
        <div className={`checkbox ${app ? 'checked' : ''} margin-right-5px`} />
        <span className="font-size-20 display-inline-block">
          {T.actionBar.connectLadger.openApp}
        </span>
      </div>
      <div className="display-flex align-items-center margin-bottom-10px">
        <div
          className={`checkbox ${version ? 'checked' : ''} margin-right-5px`}
        />
        <span className="font-size-20 display-inline-block">
          {T.actionBar.connectLadger.version}
        </span>
      </div>
    </div>
    {app && version && (
      <div className="display-flex flex-direction-column align-items-center">
        <span className="font-size-20 display-inline-block margin-bottom-10px">
          {T.actionBar.connectLadger.getDetails}
        </span>
        <Loading />
      </div>
    )}
    {/* <button onClick={onClickBtn}>1</button> */}
  </ContainetLedger>
);

export const StartStageSearchActionBar = ({
  onClickBtn,
  contentHash,
  onChangeInputContentHash,
}) => (
  <ActionBar>
    <ActionBarContentText>
      <input
        value={contentHash}
        style={{ height: 42, width: '60%' }}
        onChange={e => onChangeInputContentHash(e)}
        placeholder="paste a hash"
      />
    </ActionBarContentText>
    <Button disabled={!contentHash.length} onClick={onClickBtn}>
      {T.actionBar.startSearch.cyberlink}
    </Button>
  </ActionBar>
);

export const Cyberlink = ({
  bandwidth,
  onClickBtnCloce,
  address,
  contentHash,
  onClickBtn,
  query,
}) => (
  <ContainetLedger onClickBtnCloce={onClickBtnCloce}>
    <Pane
      marginBottom={20}
      textAlign="center"
      display="flex"
      flexDirection="column"
    >
      <Text fontSize="25px" lineHeight="40px" color="#fff">
        {T.actionBar.link.addr}
      </Text>
      <Text fontSize="16px" lineHeight="25.888px" color="#fff">
        {address}
      </Text>
    </Pane>
    <Pane
      marginBottom={25}
      textAlign="center"
      display="flex"
      flexDirection="column"
    >
      <Text fontSize="25px" lineHeight="40px" color="#fff">
        {T.actionBar.link.bandwidth}
      </Text>
      <Text fontSize="16px" lineHeight="25.888px" color="#3ab793">
        {bandwidth.remained}/{bandwidth.max_value}
      </Text>
    </Pane>
    <Text marginBottom={10} color="#fff" fontSize="16px">
      {T.actionBar.link.to} {query}
    </Text>
    <Text color="#fff" fontSize="16px">
      {T.actionBar.link.from} {contentHash}
    </Text>
    <Pane marginTop={30}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <button
          type="button"
          className="btn"
          onClick={onClickBtn}
          style={{ height: 42, maxWidth: '200px' }}
        >
          {T.actionBar.link.cyberIt}
        </button>
      </div>
    </Pane>
  </ContainetLedger>
);

export const Delegate = ({
  address,
  onClickBtnCloce,
  balance,
  moniker,
  operatorAddress,
  generateTx,
  max,
  onChangeInputAmount,
  toSend,
  disabledBtn,
}) => (
  <ContainetLedger onClickBtnCloce={onClickBtnCloce}>
    <Pane display="flex" flexDirection="column" alignItems="center">
      <Text
        marginBottom={20}
        fontSize="16px"
        lineHeight="25.888px"
        color="#fff"
      >
        {address}
      </Text>
      <Text fontSize="30px" lineHeight="40px" color="#fff">
        {T.actionBar.delegate.details}
      </Text>

      <Text fontSize="18px" lineHeight="30px" color="#fff">
        {T.actionBar.delegate.wallet}
      </Text>
      <Text
        display="flex"
        justifyContent="center"
        fontSize="20px"
        lineHeight="25.888px"
        color="#3ab793"
      >
        <FormatNumber
          marginRight={5}
          number={formatNumber(
            Math.floor((balance / DIVISOR_CYBER_G) * 1000) / 1000,
            3
          )}
        />
        {(DENOM_CYBER_G + DENOM_CYBER).toUpperCase()}
      </Text>

      <Pane marginTop={20}>
        <Text fontSize="16px" color="#fff">
          {T.actionBar.delegate.enterAmount}{' '}
          {(DENOM_CYBER_G + DENOM_CYBER).toUpperCase()}{' '}
          {T.actionBar.delegate.delegate.toLowerCase()}{' '}
          <Text fontSize="20px" color="#fff" fontWeight={600}>
            {moniker}
          </Text>
        </Text>
      </Pane>
      <Text color="#fff">{operatorAddress}</Text>
      <Pane marginY={30} display="flex">
        <input
          value={toSend}
          style={{
            height: 42,
            width: '60%',
            marginRight: 20,
          }}
          onChange={onChangeInputAmount}
          placeholder="amount"
        />
        <button
          type="button"
          className="btn"
          onClick={max}
          style={{ height: 42, maxWidth: '200px' }}
        >
          {T.actionBar.delegate.max}
        </button>
      </Pane>
      <button
        type="button"
        className="btn-disabled"
        onClick={generateTx}
        style={{ height: 42, maxWidth: '200px' }}
        disabled={disabledBtn}
      >
        {T.actionBar.delegate.generate}
      </button>
    </Pane>
  </ContainetLedger>
);

export const SendLedger = ({
  onClickBtn,
  address,
  availableStake,
  valueInputAmount,
  valueInputAddressTo,
  onChangeInputAmount,
  onChangeInputAddressTo,
  onClickBtnCloce,
  disabledBtn,
}) => (
  <ContainetLedger onClickBtnCloce={onClickBtnCloce}>
    <div className="display-flex align-items-center">
      <span className="actionBar-text">{address}</span>
      <button
        className="copy-address"
        onClick={() => {
          navigator.clipboard.writeText(address);
        }}
      />
    </div>

    <div>
      <h3 className="text-align-center">{T.actionBar.send.send}</h3>
      <p className="text-align-center">{T.actionBar.send.wallet}</p>
      <span className="actionBar-text">{availableStake}</span>

      <div
        style={{ marginBottom: 30, marginTop: 30 }}
        className="text-align-center"
      >
        <input
          value={valueInputAddressTo}
          style={{ marginRight: 10, width: '70%' }}
          onChange={onChangeInputAddressTo}
          placeholder="address"
        />

        <input
          value={valueInputAmount}
          style={{ width: '24%' }}
          onChange={onChangeInputAmount}
          placeholder="amount GEUL"
        />
      </div>
      <div className="text-align-center">
        <button
          type="button"
          className="btn-disabled"
          disabled={disabledBtn}
          onClick={onClickBtn}
        >
          {T.actionBar.send.generate}
        </button>
      </div>
    </div>
  </ContainetLedger>
);
