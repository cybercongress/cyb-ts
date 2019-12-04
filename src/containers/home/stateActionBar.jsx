import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { ActionBar, Button, Input, Pane, Text } from '@cybercongress/gravity';
import { ContainetLedger, Loading } from '../../components/index';
import { formatNumber } from '../../utils/search/utils';

const ActionBarContentText = ({ children, ...props }) => (
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
      <h3 style={{ marginBottom: 20 }}>
        Please confirm the transaction data matches what is displayed on your
        device.
      </h3>
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
      Transaction submitted
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
        Please wait while we confirm the transaction on the blockchain. This
        might take a few moments depending on the transaction fees used.
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
      Transaction Confirmed!
    </span>
    <div
      style={{ marginTop: '25px' }}
      className="display-flex flex-direction-column"
    >
      <p style={{ marginBottom: 20, textAlign: 'center' }}>
        Your transaction was included in the block at height:{' '}
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
        href={`https://callisto.cybernode.ai/transactions/${txHash}`}
      >
        View transaction
      </a>
      <div style={{ marginTop: '25px' }}>
        <span>Transaction Hash:</span>
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
          Continue
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
        cyber
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

export const SendAmounLadger = ({
  onClickBtn,
  status,
  pin,
  app,
  version,
  onClickBtnCloce,
}) => (
  <ContainetLedger onClickBtnCloce={onClickBtnCloce}>
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        fontSize: '25px',
      }}
    >
      <span className="display-inline-block margin-bottom-10px">
        Let's get started
      </span>
    </div>
    <div className="display-flex flex-direction-column margin-bottom-10px">
      <div className="display-flex align-items-center margin-bottom-10px">
        <div className={`checkbox ${pin ? 'checked' : ''} margin-right-5px`} />
        <span className="font-size-20 display-inline-block">
          Connect your Ledger Nano to the computer and enter your PIN.
        </span>
      </div>

      <div className="display-flex align-items-center margin-bottom-10px">
        <div className={`checkbox ${app ? 'checked' : ''} margin-right-5px`} />
        <span className="font-size-20 display-inline-block">
          Open the Cosmos Ledger application.
        </span>
      </div>
      <div className="display-flex align-items-center margin-bottom-10px">
        <div
          className={`checkbox ${version ? 'checked' : ''} margin-right-5px`}
        />
        <span className="font-size-20 display-inline-block">
          At least version v1.1.1 of Cosmos Ledger app installed.
        </span>
      </div>
    </div>
    {app && version && (
      <div className="display-flex flex-direction-column align-items-center">
        <span className="font-size-20 display-inline-block margin-bottom-10px">
          We are just checking the blockchain for your account details
        </span>
        <Loading />
      </div>
    )}
    {/* <button onClick={onClickBtn}>1</button> */}
  </ContainetLedger>
);
