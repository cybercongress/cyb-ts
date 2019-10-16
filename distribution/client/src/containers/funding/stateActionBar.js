import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { ContainetLedger, Loading } from '../../components/index';

const ActionBarContainer = ({ height, children }) => (
  <div className={`container-action ${height ? 'height50' : ''} `}>
    {children}
  </div>
);

export const ContributeATOMs = ({
  onClickBtn,
  address,
  availableStake,
  valueInput,
  gasUAtom,
  gasAtom,
  onChangeInput,
  onClickBtnCloce,
  onClickMax
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
    {availableStake > 0 && (
      <div>
        <h3 className="text-align-center">Send Details</h3>
        <p className="text-align-center">Your wallet contains:</p>
        <span className="actionBar-text">{availableStake}</span>
        <div style={{ marginTop: '25px', marginBottom: 10 }}>
          Enter the amount of ATOMs you wish to send to Cyber~Congress:
        </div>
        <div className="text-align-center">
          <input
            value={valueInput}
            style={{ marginRight: 10 }}
            onChange={onChangeInput}
          />
          <button className="btn" onClick={onClickMax} style={{ height: 30 }}>
            Max
          </button>
        </div>
        <h6 style={{ margin: 20 }}>
          The fees you will be charged by the network on this transaction will
          {gasUAtom} uatom ( {gasAtom} ATOMs ).
        </h6>
        <div className="text-align-center">
          <button type="button" className="btn" onClick={onClickBtn}>
            Generate my transaction
          </button>
        </div>
      </div>
    )}
  </ContainetLedger>
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
        alignItems: 'center'
      }}
    >
      <span
        style={{
          marginBottom: '20px',
          maxWidth: '70%',
          fontSize: '16px'
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
  onClickBtnCloce
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
            marginLeft: '5px'
          }}
        >
          {txHeight}
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
          margin: '0 auto'
        }}
        href={`https://cosmos.bigdipper.live/transactions/${txHash}`}
      >
        View transaction
      </a>
      <div style={{ marginTop: '25px' }}>
        <span>Transaction Hash:</span>
        <span
          style={{
            fontSize: '12px',
            color: '#3ab793',
            marginLeft: '5px'
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

export const StartState = ({ onClickBtn, valueSelect, onChangeSelect }) => (
  <ActionBarContainer>
    <div className="container-action-content">
      <div className="action-text">
        <span className="actionBar-text">Contribute ATOMs</span>
        {/* <select value={valueSelect} onChange={onChangeSelect}>
          <option value="address">Any cosmos wallet</option>
          <option value="ledger">Ledger</option>
        </select> */}
      </div>
      <button className="btn" onClick={onClickBtn}>
        Fuck Google
      </button>
    </div>
  </ActionBarContainer>
);

export const SendAmount = ({ onClickBtn, address, onClickBtnCloce }) => (
  <div className="container-action height50 box-shadow-1px">
    <div style={{ position: 'absolute', padding: '0 5px', right: 3, top: 5 }}>
      <span>
        [
        <a
          onClick={onClickBtnCloce}
          style={{ color: 'rgb(225, 225, 225)', cursor: 'pointer' }}
        >
          exit
        </a>
        ]
      </span>
    </div>
    <div className="container-action-content height100">
      <div className="container-send">
        <div>
          <div>
            <span
              className="display-inline-block text-align-center"
              style={{
                marginBottom: 20,
                fontSize: '16px'
              }}
            >
              Send any amount of ATOMs directly to cyber~Congress multisig by
              your using Cosmos wallet
            </span>
            <div
              className="display-flex align-items-center"
              style={{
                justifyContent: 'center'
              }}
            >
              <span className="font-size-16">{address}</span>
              <button
                className="copy-address"
                onClick={() => {
                  navigator.clipboard.writeText(address);
                }}
              />
            </div>
          </div>
        </div>
        <div className="line-action-bar" />
        <div className="display-flex flex-direction-column align-items-center">
          <div className="display-flex flex-direction-column">
            {/* <span className="display-inline-block font-size-20 margin-bottom-10px">
              Ledger
            </span> */}
            <button className="btn" onClick={onClickBtn}>
              Send with Ledger
            </button>
          </div>
        </div>
      </div>
      {/* <span className="actionBar-text">
          You can send any amount of ATOMs to cyber•Congress multisig
          cosmos287fhhlgflsef
        </span>
      </div>
      <button className="btn" onClick={onClickBtn}>
        Track Contribution
      </button> */}
    </div>
  </div>
);

export const SendAmounLadger = ({
  onClickBtn,
  status,
  pin,
  app,
  version,
  onClickBtnCloce
}) => (
  <ContainetLedger onClickBtnCloce={onClickBtnCloce}>
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        fontSize: '25px'
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
          Connect your Ledger Nano S to the computer and enter your PIN.
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

export const PutAddress = ({ onClickBtn }) => (
  <div className="container-action">
    <div className="container-action-content">
      <div className="action-text">
        <span className="actionBar-text">
          Put address of wrom which you contributed <input />
        </span>
      </div>
      <button className="btn" onClick={onClickBtn}>
        Save address
      </button>
    </div>
  </div>
);

// const ContributeATOMs = ({ onClickBtn, address, availableStake, canStake }) => (
//   <div className="container-action">
//     <div className="container-action-content">
//       <div className="action-text">
//         <span className="actionBar-text">
//          {address}
//         </span>
//         <span className="actionBar-text">
//          {availableStake}
//         </span>
//         <span className="actionBar-text">
//          {canStake}
//         </span>
//       </div>
//       <button className="btn" onClick={onClickBtn}>
//         Confirm
//       </button>
//     </div>
//   </div>
// );

export const TransactionCost = ({ onClickBtn }) => (
  <div className="container-action">
    <div className="container-action-content">
      <div className="action-text">
        <span className="actionBar-text">Transaction cost is 0.1 uATOM</span>
      </div>
      <button className="btn" onClick={onClickBtn}>
        Sign
      </button>
    </div>
  </div>
);

export const Succesfuuly = ({ onClickBtn }) => (
  <div className="container-action">
    <div className="container-action-content">
      <div className="action-text">
        <span className="actionBar-text">
          Tx <a>id</a> succesfuuly confirmed
        </span>
      </div>
      {/* <button className="btn" onClick={onClickBtn}>
                Confirm
            </button> */}
    </div>
  </div>
);
