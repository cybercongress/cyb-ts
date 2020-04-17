import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import LocalizedStrings from 'react-localization';
import { Link } from 'react-router-dom';
import {
  ActionBar,
  Button,
  Input,
  Pane,
  Text,
  Select,
  Textarea,
  FilePicker,
  Battery,
} from '@cybercongress/gravity';
import { ContainetLedger } from './container';
import { Loading } from '../ui/loading';
import { Dots } from '../ui/Dots';
import Account from '../account/account';
import { FormatNumber } from '../formatNumber/formatNumber';

import { formatNumber, trimString } from '../../utils/utils';

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
  explorer,
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
        <Link
          to={`/network/euler/block/${txHeight}`}
          style={{
            marginLeft: '5px',
          }}
        >
          {formatNumber(txHeight)}
        </Link>
      </p>

      {explorer ? (
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
          href={`https://${explorer}/transactions/${txHash}`}
        >
          {T.actionBar.confirmedTX.viewTX}
        </a>
      ) : (
        <Link
          to={`/network/euler/tx/${txHash}`}
          className="btn"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 auto',
          }}
        >
          {T.actionBar.confirmedTX.viewTX}
        </Link>
      )}

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

export const TransactionError = ({
  onClickBtn,
  onClickBtnCloce,
  errorMessage,
}) => (
  <ContainetLedger onClickBtnCloce={onClickBtnCloce}>
    <span className="font-size-20 display-inline-block text-align-center">
      Transaction Error:
    </span>
    <div
      style={{ marginTop: '25px', width: '80%', margin: '0 auto' }}
      className="display-flex flex-direction-column"
    >
      <p style={{ marginBottom: 20, textAlign: 'center' }}>
        Message:
        <span
          style={{
            color: '#3ab793',
            marginLeft: '5px',
          }}
        >
          {errorMessage}
        </span>
      </p>
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

export const ConnectLadger = ({ pin, app, version }) => (
  <ActionBar>
    <ActionBarContentText>
      Connect Ledger, enter pin and open Cosmos app <Dots big />
    </ActionBarContentText>
  </ActionBar>
);

export const CheckAddressInfo = () => (
  <ActionBar>
    <ActionBarContentText>
      {T.actionBar.connectLadger.getDetails} <Dots big />
    </ActionBarContentText>
  </ActionBar>
);

export const StartStageSearchActionBar = ({
  onClickBtn,
  contentHash,
  onChangeInputContentHash,
  showOpenFileDlg,
  inputOpenFileRef,
  onChangeInput,
  onClickClear,
  file,
}) => {
  return (
    <ActionBar>
      <ActionBarContentText>
        <Pane
          display="flex"
          flexDirection="column"
          position="relative"
          width="60%"
        >
          <input
            value={contentHash}
            style={{
              height: 42,
              width: '100%',
              paddingLeft: '10px',
              borderRadius: '20px',
              textAlign: 'center',
              paddingRight: '35px',
            }}
            onChange={e => onChangeInputContentHash(e)}
            placeholder="paste a hash"
          />
          <Pane
            position="absolute"
            right="0"
            top="50%"
            transform="translate(0, -50%)"
          >
            <input
              ref={inputOpenFileRef}
              onChange={() => onChangeInput(inputOpenFileRef)}
              type="file"
              style={{ display: 'none' }}
            />
            <button
              className={
                file !== null && file !== undefined
                  ? 'btn-add-close'
                  : 'btn-add-file'
              }
              onClick={
                file !== null && file !== undefined
                  ? onClickClear
                  : showOpenFileDlg
              }
            />
          </Pane>
        </Pane>
      </ActionBarContentText>
      <Button disabled={!contentHash.length} onClick={onClickBtn}>
        {T.actionBar.startSearch.cyberlink}
      </Button>
    </ActionBar>
  );
};

export const GovernanceStartStageActionBar = ({
  valueSelect,
  onChangeSelect,
  onClickBtn,
}) => (
  <ActionBar>
    <ActionBarContentText>
      <select
        style={{ height: 42, width: '60%' }}
        className="select-green"
        value={valueSelect}
        onChange={onChangeSelect}
      >
        <option value="textProposal">Text Proposal</option>
        {/* <option value="paramChange">Param Change</option> */}
        <option value="communityPool">Community Pool Spend</option>
      </select>
    </ActionBarContentText>
    <Button onClick={onClickBtn}>Create Governance</Button>
  </ActionBar>
);

export const TextProposal = ({
  onClickBtn,
  addrProposer,
  onClickBtnCloce,
  onChangeInputTitle,
  onChangeInputDescription,
  onChangeInputDeposit,
  valueDescription,
  valueTitle,
  valueDeposit,
}) => (
  <ActionBar>
    <ContainetLedger logo onClickBtnCloce={onClickBtnCloce}>
      <Pane display="flex" flexDirection="column" alignItems="center">
        <Text fontSize="25px" lineHeight="40px" color="#fff">
          Text Proposal
        </Text>
        <Text fontSize="18px" lineHeight="40px" color="#fff">
          proposer
        </Text>
        <Text color="#fff">{addrProposer}</Text>
        <Pane marginY={10} width="100%">
          <Text color="#fff">title</Text>
          <input
            value={valueTitle}
            style={{
              height: 42,
              width: '100%',
            }}
            onChange={onChangeInputTitle}
            placeholder="title"
          />
        </Pane>
        <Pane marginBottom={10} width="100%">
          <Text color="#fff">description</Text>
          <textarea
            onChange={onChangeInputDescription}
            value={valueDescription}
            className="resize-none"
          />
        </Pane>
        <Pane width="100%">
          <Text color="#fff">deposit, EUL</Text>
          <input
            value={valueDeposit}
            style={{
              height: 42,
              width: '100%',
            }}
            onChange={onChangeInputDeposit}
            placeholder="amount, GEUL"
          />
        </Pane>
        <Button marginTop={25} onClick={onClickBtn}>
          Create Governance
        </Button>
      </Pane>
    </ContainetLedger>
  </ActionBar>
);

export const ParamChange = ({ valueSelect, onChangeSelect, onClickBtn }) => (
  <ActionBar>
    <ActionBarContentText>
      {/* <select
        style={{ height: 42, width: '60%' }}
        className="select-green"
        value={valueSelect}
        onChange={onChangeSelect}
      >
        <option value="textProposal">Text Proposal</option>
        <option value="paramChange">Param Change</option>
        <option value="communityPool">Community Pool Spend</option>
      </select> */}
    </ActionBarContentText>
    <Button onClick={onClickBtn}>Create Governance</Button>
  </ActionBar>
);

export const CommunityPool = ({
  onClickBtn,
  addrProposer,
  onClickBtnCloce,
  onChangeInputTitle,
  onChangeInputDescription,
  onChangeInputDeposit,
  valueDescription,
  valueTitle,
  valueDeposit,
  valueAddressRecipient,
  onChangeInputAmountRecipient,
  onChangeInputAddressRecipient,
  valueAmountRecipient,
}) => (
  <ActionBar>
    <ContainetLedger logo onClickBtnCloce={onClickBtnCloce}>
      <Pane display="flex" flexDirection="column" alignItems="center">
        <Text fontSize="25px" lineHeight="40px" color="#fff">
          Community Pool Spend
        </Text>
        <Text fontSize="18px" lineHeight="40px" color="#fff">
          proposer
        </Text>
        <Text color="#fff">{addrProposer}</Text>
        <Pane marginY={10} width="100%">
          <Text color="#fff">title</Text>
          <input
            value={valueTitle}
            style={{
              height: 42,
              width: '100%',
            }}
            onChange={onChangeInputTitle}
            placeholder="title"
          />
        </Pane>
        <Pane marginBottom={10} width="100%">
          <Text color="#fff">description</Text>
          <textarea
            onChange={onChangeInputDescription}
            value={valueDescription}
            className="resize-none"
          />
        </Pane>
        <Pane marginBottom={10} width="100%">
          <Text color="#fff">recipient</Text>
          <Pane display="grid" gridTemplateColumns="0.8fr 0.2fr" gridGap="10px">
            <input
              value={valueAddressRecipient}
              style={{
                height: 42,
                width: '100%',
              }}
              onChange={onChangeInputAddressRecipient}
              placeholder="address"
            />
            <input
              value={valueAmountRecipient}
              style={{
                height: 42,
                width: '100%',
              }}
              onChange={onChangeInputAmountRecipient}
              placeholder="GEUL"
            />
          </Pane>
        </Pane>
        <Pane width="100%">
          <Text color="#fff">deposit, EUL</Text>
          <input
            value={valueDeposit}
            style={{
              height: 42,
              width: '100%',
            }}
            onChange={onChangeInputDeposit}
            placeholder="amount, GEUL"
          />
        </Pane>
        <Button marginTop={25} onClick={onClickBtn}>
          Create Governance
        </Button>
      </Pane>
    </ContainetLedger>
  </ActionBar>
);

const ContentTooltip = ({ bwRemained, bwMaxValue, linkPrice }) => (
  <Pane
    minWidth={200}
    paddingX={18}
    paddingY={14}
    borderRadius={4}
    backgroundColor="#fff"
  >
    <Pane marginBottom={5}>
      <Text size={300}>
        You have {bwRemained} BP out of {bwMaxValue} BP.
      </Text>
    </Pane>
    <Pane marginBottom={5}>
      <Text size={300}>
        Full regeneration of bandwidth points or BP happens in 24 hours.
      </Text>
    </Pane>
    <Pane display="flex">
      <Text size={300}>
        Current rate for 1 cyberlink is{' '}
        {linkPrice} BP.
      </Text>
    </Pane>
  </Pane>
);

export const Cyberlink = ({
  bandwidth,
  onClickBtnCloce,
  address,
  contentHash,
  onClickBtn,
  query,
  disabledBtn,
  linkPrice,
}) => {
  return (
    <ActionBar>
      <ActionBarContentText flexDirection="column">
        <Pane>
          <Pane display="flex">
            <Pane display="flex" alignItems="center" marginRight={10}>
              <Pane fontSize="16px" marginRight={5}>
                address:
              </Pane>
              <Text fontSize="16px" lineHeight="25.888px" color="#fff">
                {address}
              </Text>
            </Pane>
            <Pane display="flex" alignItems="center">
              <Pane fontSize="16px" marginRight={5}>
                bandwidth:
              </Pane>
              <Battery
                style={{ width: '140px', height: '16px' }}
                bwPercent={(bandwidth.remained / bandwidth.max_value) * 100}
                contentTooltip={
                  <ContentTooltip
                    bwRemained={bandwidth.remained}
                    bwMaxValue={bandwidth.max_value}
                    linkPrice={linkPrice}
                  />
                }
              />
            </Pane>
          </Pane>
          <Pane display="flex" flexDirection="column">
            <Text color="#fff" marginRight={10} fontSize="16px">
              {T.actionBar.link.from}{' '}
              {contentHash.length > 12
                ? trimString(contentHash, 6, 6)
                : contentHash}
            </Text>
            <Text color="#fff" fontSize="16px">
              {T.actionBar.link.to} {query}
            </Text>
          </Pane>
        </Pane>
      </ActionBarContentText>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          // width: '100%',
        }}
      >
        <button
          type="button"
          className="btn-disabled"
          onClick={onClickBtn}
          style={{ height: 42, maxWidth: '200px' }}
          disabled={disabledBtn}
        >
          {T.actionBar.link.cyberIt}
        </button>
      </div>
    </ActionBar>
  );
};

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
  delegate,
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
        {delegate
          ? T.actionBar.delegate.details
          : T.actionBar.delegate.detailsUnDelegate}
      </Text>

      <Text fontSize="18px" lineHeight="30px" color="#fff">
        {delegate
          ? T.actionBar.delegate.wallet
          : T.actionBar.delegate.yourDelegated}
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
          number={formatNumber(balance / DIVISOR_CYBER_G, 6)}
        />
        {DENOM_CYBER_G.toUpperCase()}
      </Text>

      <Pane marginTop={20}>
        <Text fontSize="16px" color="#fff">
          {T.actionBar.delegate.enterAmount} {DENOM_CYBER_G.toUpperCase()}{' '}
          {delegate
            ? T.actionBar.delegate.delegate
            : T.actionBar.delegate.unDelegateFrom}{' '}
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

export const ReDelegate = ({
  address,
  onClickBtnCloce,
  generateTx,
  onChangeInputAmount,
  toSend,
  disabledBtn,
  validators,
  validatorsAll,
  valueSelect,
  onChangeReDelegate,
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
        Restake details
      </Text>

      <Text fontSize="18px" lineHeight="30px" color="#fff">
        {T.actionBar.delegate.yourDelegated}
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
          number={formatNumber(validators.delegation / DIVISOR_CYBER_G, 6)}
        />
        {DENOM_CYBER_G.toUpperCase()}
      </Text>

      <Pane marginY={20}>
        <Text fontSize="16px" color="#fff">
          {T.actionBar.delegate.enterAmount} {DENOM_CYBER_G.toUpperCase()}{' '}
          restake from{' '}
          <Text fontSize="20px" color="#fff" fontWeight={600}>
            {validators.description.moniker}
          </Text>
        </Text>
      </Pane>
      <Pane marginBottom={30} display="flex" alignItems="center">
        <input
          value={toSend}
          style={{
            height: 32,
            width: '70px',
            marginRight: 10,
          }}
          onChange={onChangeInputAmount}
          placeholder="amount"
        />
        <Pane display="flex" alignItems="center">
          to:{' '}
          <select value={valueSelect} onChange={onChangeReDelegate}>
            <option value="">pick hero</option>
            {validatorsAll
              .filter(validator => validator.status > 0)
              .map(item => (
                <option
                  key={item.operator_address}
                  value={item.operator_address}
                  style={{
                    display:
                      validators.operator_address === item.operator_address
                        ? 'none'
                        : 'block',
                  }}
                >
                  {item.description.moniker}
                </option>
              ))}
          </select>
        </Pane>
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

export const SendLedgerAtomTot = ({
  onClickBtn,
  address,
  availableStake,
  onClickBtnCloce,
  disabledBtn,
  amount,
  addressTo,
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
      <h3 className="text-align-center">Contribution Details</h3>
      <p className="text-align-center">{T.actionBar.send.wallet}</p>
      <span className="actionBar-text">{availableStake}</span>

      <div style={{ marginBottom: 30, marginTop: 30 }}>
        <div style={{ marginBottom: 10 }}>
          <span style={{ marginRight: 10 }}>address to:</span>
          <span>{addressTo}</span>
        </div>
        <div>
          <span style={{ marginRight: 10 }}>contribution amount:</span>
          <span>{amount} ATOMs</span>
        </div>
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

export const ContributeATOMs = ({
  onClickBtn,
  address,
  availableStake,
  valueInput,
  gasUAtom,
  gasAtom,
  onChangeInput,
  onClickBtnCloce,
  onClickMax,
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
            style={{ marginRight: 10, textAlign: 'end' }}
            onChange={onChangeInput}
          />
          <button
            type="button"
            className="btn"
            onClick={onClickMax}
            style={{ height: 30 }}
          >
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
                fontSize: '16px',
              }}
            >
              Send any amount of ATOMs directly to cyber~Congress multisig by
              your using Cosmos wallet
            </span>
            <div
              className="display-flex align-items-center"
              style={{
                justifyContent: 'center',
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

export const RewardsDelegators = ({
  data,
  address,
  onClickBtn,
  onClickBtnCloce,
  disabledBtn,
}) => {
  const itemReward = data.rewards.map(item => (
    <Pane
      key={item.validator_address}
      display="flex"
      justifyContent="space-between"
    >
      <Account address={item.validator_address} />
      <Pane>
        {formatNumber(Math.floor(item.reward[0].amount))}{' '}
        {CYBER.DENOM_CYBER.toUpperCase()}
      </Pane>
    </Pane>
  ));
  return (
    <ContainetLedger onClickBtnCloce={onClickBtnCloce}>
      <Text
        marginBottom={20}
        fontSize="16px"
        lineHeight="25.888px"
        color="#fff"
      >
        {address}
      </Text>
      <Pane fontSize="20px" marginBottom={20}>
        Total rewards: {formatNumber(Math.floor(data.total[0].amount))}{' '}
        {CYBER.DENOM_CYBER.toUpperCase()}
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
        <button
          type="button"
          className="btn-disabled"
          disabled={disabledBtn}
          onClick={onClickBtn}
        >
          {T.actionBar.send.generate}
        </button>
      </div>
    </ContainetLedger>
  );
};
