import { useState, useEffect } from 'react';
import LocalizedStrings from 'react-localization';
import { Link } from 'react-router-dom';
import {
  ActionBar,
  Pane,
  Text,
  Battery,
  IconButton,
} from '@cybercongress/gravity';

import { ContainetLedger } from './container';
import { Dots } from '../ui/Dots';
import Account from '../account/account';
import { LinkWindow } from '../link/link';
import { formatNumber, trimString, selectNetworkImg } from '../../utils/utils';

import { i18n } from '../../i18n/en';

import { CYBER, BOND_STATUS } from '../../utils/config';
import Button from '../btnGrd';
import { InputNumber, Input } from '../Input';
import ActionBarContainer from '../actionBar';
import ButtonIcon from '../buttons/ButtonIcon';
import { Color } from '../LinearGradientContainer/LinearGradientContainer';
import AddFileButton from '../buttons/AddFile/AddFile';
import { useBackend } from 'src/contexts/backend';

const { DENOM_CYBER } = CYBER;

const param = {
  slashing: [
    'signed_blocks_window',
    'min_signed_per_window',
    'downtime_jail_duration',
    'slash_fraction_double_sign',
    'slash_fraction_downtime',
  ],
  bandwidth: [
    'tx_cost',
    'link_msg_cost',
    'non_link_msg_cost',
    'recovery_period',
    'adjust_price_period',
    'base_credit_price',
    'desirable_bandwidth',
    'max_block_bandwidth',
  ],
  distribution: [
    'community_tax',
    'base_proposer_reward',
    'bonus_proposer_reward',
    'withdraw_addr_enabled',
  ],
  mint: [
    'mint_denom',
    'inflation_rate_change',
    'inflation_max',
    'inflation_min',
    'goal_bonded',
    'blocks_per_year',
  ],
  evidence: ['max_evidence_age'],
  auth: [
    'max_memo_characters',
    'tx_sig_limit',
    'tx_size_cost_per_byte',
    'sig_verify_cost_ed25519',
    'sig_verify_cost_secp256k1',
  ],
  rank: ['calculation_period', 'damping_factor', 'tolerance'],
  staking: [
    'unbonding_time',
    'max_validators',
    'max_entries',
    'historical_entries',
    'bond_denom',
  ],
  gov: {
    deposit_params: ['min_deposit', 'max_deposit_period'],
    voting_params: ['voting_period'],
    tally_params: ['quorum', 'threshold', 'veto'],
  },
};

const imgLedger = require('../../image/ledger.svg');
const imgKeplr = require('../../image/keplr-icon.svg');
const imgMetaMask = require('../../image/mm-logo.svg');
const imgRead = require('../../image/duplicate-outline.svg');
const imgEth = require('../../image/Ethereum_logo_2014.svg');
const imgCosmos = require('../../image/cosmos-2.svg');

const T = new LocalizedStrings(i18n);
const ledger = require('../../image/select-pin-nano2.svg');

const toPascalCase = (str) =>
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[a-zA-Z0-9]+/g)
    .map((cht) => cht.charAt(0).toUpperCase() + cht.substr(1).toLowerCase())
    .join('');

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

export function JsonTransaction() {
  return (
    <ActionBar>
      <ActionBarContentText>
        Confirm transaction on your Ledger{' '}
        <img
          alt="legder"
          style={{
            paddingTop: '8px',
            marginLeft: '10px',
            width: '150px',
            height: '50px',
          }}
          src={ledger}
        />
      </ActionBarContentText>
    </ActionBar>
  );
}

export function TransactionSubmitted() {
  return (
    <ActionBar>
      <ActionBarContentText>
        Please wait while we confirm the transaction on the blockchain{' '}
        <Dots big />
      </ActionBarContentText>
    </ActionBar>
  );
}

export function Confirmed({ txHash, txHeight, cosmos, onClickBtnClose }) {
  return (
    <ActionBar>
      <ActionBarContentText display="inline">
        <Pane display="inline">Transaction</Pane>{' '}
        {cosmos ? (
          <LinkWindow to={`https://www.mintscan.io/txs/${txHash}`}>
            {trimString(txHash, 6, 6)}
          </LinkWindow>
        ) : (
          <Link to={`/network/bostrom/tx/${txHash}`}>
            {trimString(txHash, 6, 6)}
          </Link>
        )}{' '}
        <Pane display="inline">
          was included in the block <br /> at height{' '}
          {formatNumber(parseFloat(txHeight))}
        </Pane>
      </ActionBarContentText>
      <Button style={{ margin: '0 10px' }} onClick={onClickBtnClose}>
        Fuck Google
      </Button>
    </ActionBar>
  );
}

export function TransactionError({ onClickBtn, errorMessage }) {
  return (
    <ActionBar>
      <ActionBarContentText display="block">
        Message Error: {errorMessage}
      </ActionBarContentText>
      <Button style={{ margin: '0 10px' }} onClick={onClickBtn}>
        {T.actionBar.confirmedTX.continue}
      </Button>
    </ActionBar>
  );
}

export function ConnectLadger({ connectLedger, onClickConnect }) {
  return (
    <ActionBar>
      <ActionBarContentText display="inline-flex" flexDirection="column">
        <div>
          Connect Ledger, enter pin and open Cosmos app <Dots big />
        </div>
        {connectLedger === false && (
          <Pane fontSize="14px" color="#f00">
            Cosmos app is not open
          </Pane>
        )}
      </ActionBarContentText>
      {connectLedger === false && (
        <Button onClick={onClickConnect}>Connect</Button>
      )}
    </ActionBar>
  );
}

export function CheckAddressInfo() {
  return (
    <ActionBar>
      <ActionBarContentText>
        {T.actionBar.connectLadger.getDetails} <Dots big />
      </ActionBarContentText>
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
  textBtn = 'Cyberlink',
  placeholder = 'add keywords, hash or file',
  keys = 'ledger',
}) {
  const { isIpfsInitialized } = useBackend();
  return (
    <ActionBarContainer
      button={{
        disabled: !isIpfsInitialized || !contentHash.length,
        onClick: onClickBtn,
        text: !isIpfsInitialized ? (
          <>
            Node is loading&nbsp;
            <Dots />
          </>
        ) : (
          textBtn
        ),
      }}
    >
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
    </ActionBarContainer>
  );
}

export function GovernanceStartStageActionBar({
  // valueSelect,
  // onChangeSelect,
  onClickBtn,
}) {
  return (
    <ActionBarContainer
      button={{
        text: 'Propose',
        onClick: onClickBtn,
      }}
    >
      {/* <ActionBarContentText>
        <select
          style={{ height: 42, width: '60%' }}
          className="select-green"
          value={valueSelect}
          onChange={onChangeSelect}
        >
          <option value="textProposal">Text Proposal</option>
          <option value="communityPool">Community Pool Spend</option>
        <option value="paramChange">Param Change</option>
        <option value="softwareUpgrade">Software Upgrade</option>
        </select>
      </ActionBarContentText> */}
    </ActionBarContainer>
  );
}

export function GovernanceChangeParam({
  valueSelect,
  onChangeSelect,
  onClickBtn,
  onClickBtnAddParam,
  valueParam = '',
  onChangeInputParam,
  changeParam,
  onClickDeleteParam,
  onClickBtnClose,
  valueTitle,
  onChangeInputTitle,
  onChangeInputDescription,
  valueDescription,
  valueDeposit,
  onChangeInputDeposit,
}) {
  const item = [];
  let itemChangeParam = [];

  Object.keys(param).map((key) => {
    if (param[key].constructor.name === 'Array') {
      item.push(
        <option
          style={{ color: '#fff', fontSize: '20px' }}
          disabled="disabled"
          key={key}
          value=""
        >
          {key}
        </option>
      );
      const temp = param[key].map((items) => (
        <option
          key={items}
          value={JSON.stringify({
            subspace: key,
            key: toPascalCase(items),
            value: '',
          })}
        >
          {toPascalCase(items)}
        </option>
      ));
      if (temp) {
        item.push(...temp);
      }
    }
    return undefined;
  });

  if (changeParam.length > 0) {
    itemChangeParam = changeParam.map((items, index) => (
      <Pane width="100%" display="flex" key={items.key}>
        <Pane flex={1}>{items.key}</Pane>
        <Pane flex={1}>{items.value}</Pane>
        <IconButton
          onClick={() => onClickDeleteParam(index)}
          appearance="minimal"
          height={24}
          icon="trash"
          intent="danger"
        />
      </Pane>
    ));
  }

  return (
    <ActionBar>
      <ContainetLedger
        styles={{ height: 'unset' }}
        logo
        onClickBtnClose={onClickBtnClose}
      >
        <Pane display="flex" flexDirection="column" alignItems="center">
          <Text fontSize="25px" lineHeight="40px" color="#fff">
            Parameter Change Proposal
          </Text>
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
          <Pane width="100%">
            <Text color="#fff">description</Text>
            <textarea
              onChange={onChangeInputDescription}
              value={valueDescription}
              className="resize-none"
            />
          </Pane>
          <Pane marginY={10} width="100%">
            <Text color="#fff">deposit, GEUL</Text>
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
          <Pane marginBottom={10}>
            <Text color="#fff">parameters</Text>
            <Pane display="flex">
              <select
                style={{ height: 42, marginLeft: 0, width: '210px' }}
                className="select-green"
                value={valueSelect}
                onChange={onChangeSelect}
              >
                {item !== undefined && item}
              </select>
              <input
                value={valueParam}
                disabled={valueSelect.length === 0}
                style={{
                  height: 42,
                  width: '200px',
                  marginRight: 15,
                }}
                onChange={onChangeInputParam}
                placeholder="value"
              />
              <Button
                disabled={valueSelect.length === 0 || valueParam.length === 0}
                onClick={onClickBtnAddParam}
              >
                Add
              </Button>
            </Pane>
          </Pane>
          {itemChangeParam.length > 0 && (
            <>
              <Pane marginBottom={10} width="100%" display="flex">
                <Pane flex={1}>Change Param</Pane>
                <Pane flex={1}>Value</Pane>
              </Pane>
              <Pane marginBottom={20} width="100%">
                {itemChangeParam}
              </Pane>
            </>
          )}

          <Button
            disabled={itemChangeParam.length === 0}
            marginTop={25}
            onClick={onClickBtn}
          >
            Create Governance
          </Button>
        </Pane>
      </ContainetLedger>
    </ActionBar>
  );
}

export function GovernanceSoftwareUpgrade({
  onClickBtn,
  onClickBtnClose,
  onChangeInputTitle,
  onChangeInputDescription,
  onChangeInputDeposit,
  valueDescription,
  valueTitle,
  valueDeposit,
  valueHeightUpgrade,
  valueNameUpgrade,
  onChangeInputValueNameUpgrade,
  onChangeInputValueHeightUpgrade,
}) {
  return (
    <ActionBar>
      <ContainetLedger logo onClickBtnClose={onClickBtnClose}>
        <Pane display="flex" flexDirection="column" alignItems="center">
          <Text fontSize="25px" lineHeight="40px" color="#fff">
            Software Upgrade Proposal
          </Text>
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
          <Pane marginY={10} width="100%">
            <Text color="#fff">Upgrade name</Text>
            <input
              value={valueNameUpgrade}
              style={{
                height: 42,
                width: '100%',
              }}
              onChange={onChangeInputValueNameUpgrade}
              placeholder="title"
            />
          </Pane>
          <Pane marginY={10} width="100%">
            <Text color="#fff">Upgrade height</Text>
            <input
              value={valueHeightUpgrade}
              style={{
                height: 42,
                width: '100%',
              }}
              onChange={onChangeInputValueHeightUpgrade}
              placeholder="title"
            />
          </Pane>
          <Pane width="100%">
            <Text color="#fff">deposit, GEUL</Text>
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
}

export function TextProposal({
  onClickBtn,
  // addrProposer,
  onClickBtnClose,
  onChangeInputTitle,
  onChangeInputDescription,
  onChangeInputDeposit,
  valueDescription,
  valueTitle,
  valueDeposit,
}) {
  return (
    <ActionBar>
      <ContainetLedger logo onClickBtnClose={onClickBtnClose}>
        <Pane display="flex" flexDirection="column" alignItems="center">
          <Text fontSize="25px" lineHeight="40px" color="#fff">
            Text Proposal
          </Text>
          {/* <Text fontSize="18px" lineHeight="40px" color="#fff">
          proposer
        </Text>
        <Text color="#fff">{addrProposer}</Text> */}
          <Pane marginY={10} width="100%">
            <Input
              value={valueTitle}
              onChange={onChangeInputTitle}
              placeholder="title"
            />
          </Pane>
          <Pane marginTop={20} marginBottom={10} width="100%">
            <textarea
              onChange={onChangeInputDescription}
              value={valueDescription}
              className="resize-none"
              placeholder="description"
            />
          </Pane>
          <Pane width="100%">
            <Text color="#fff">deposit, {CYBER.DENOM_CYBER.toUpperCase()}</Text>
            <InputNumber
              value={valueDeposit}
              onChange={onChangeInputDeposit}
              placeholder="amount"
            />
          </Pane>
          <Button
            style={{
              marginTop: 25,
            }}
            disabled={!valueTitle || !valueDescription || !valueDeposit}
            onClick={onClickBtn}
          >
            Create Governance
          </Button>
        </Pane>
      </ContainetLedger>
    </ActionBar>
  );
}

// function ParamChange({ onClickBtn }) {
//   return (
//     <ActionBar>
//       <ActionBarContentText>
//         {/* <select
//         style={{ height: 42, width: '60%' }}
//         className="select-green"
//         value={valueSelect}
//         onChange={onChangeSelect}
//       >
//         <option value="textProposal">Text Proposal</option>
//         <option value="paramChange">Param Change</option>
//         <option value="communityPool">Community Pool Spend</option>
//       </select> */}
//       </ActionBarContentText>
//       <Button onClick={onClickBtn}>Create Governance</Button>
//     </ActionBar>
//   );
// }

export function CommunityPool({
  onClickBtn,
  // addrProposer,
  onClickBtnClose,
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
}) {
  return (
    <ActionBar>
      <ContainetLedger logo onClickBtnClose={onClickBtnClose}>
        <Pane display="flex" flexDirection="column" alignItems="center">
          <Text fontSize="25px" lineHeight="40px" color="#fff">
            Community Pool Spend
          </Text>
          {/* <Text fontSize="18px" lineHeight="40px" color="#fff">
          proposer
        </Text>
        <Text color="#fff">{addrProposer}</Text> */}
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
            <Pane
              display="grid"
              gridTemplateColumns="0.8fr 0.2fr"
              gridGap="10px"
            >
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
}

function ContentTooltip({ bwRemained, bwMaxValue, linkPrice }) {
  return (
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
        <Text size={300}>Current rate for 1 cyberlink is {linkPrice} BP.</Text>
      </Pane>
    </Pane>
  );
}

export function Cyberlink({
  bandwidth,
  address,
  contentHash,
  onClickBtn,
  query,
  disabledBtn,
  linkPrice,
}) {
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
                bwPercent={Math.floor(
                  (bandwidth.remained / bandwidth.max_value) * 100
                )}
                contentTooltip={
                  <ContentTooltip
                    bwRemained={Math.floor(bandwidth.remained)}
                    bwMaxValue={Math.floor(bandwidth.max_value)}
                    linkPrice={Math.floor(linkPrice)}
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
        }}
      >
        <Button
          onClick={onClickBtn}
          style={{ maxWidth: '200px' }}
          disabled={disabledBtn}
        >
          {T.actionBar.link.cyberIt}
        </Button>
      </div>
    </ActionBar>
  );
}

function IntupAutoSize({
  value,
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
      onkeypress={changefontsize()}
      autoFocus={autoFocus}
      onValueChange={onChangeInputAmount}
      placeholder={placeholder}
      width="180px"
    />
  );
}

export function Delegate({
  moniker,
  generateTx,
  onChangeInputAmount,
  toSend,
  disabledBtn,
  delegate,
  onClickBack,
}) {
  return (
    <ActionBarContainer
      onClickBack={onClickBack}
      button={{
        text: T.actionBar.delegate.generate,
        onClick: generateTx,
        disabled: disabledBtn,
      }}
    >
      <Text marginRight={20} fontSize="16px" color="#fff">
        {delegate
          ? T.actionBar.delegate.delegate
          : T.actionBar.delegate.unDelegateFrom}{' '}
        <Text fontSize="20px" color="#fff" fontWeight={600}>
          {moniker && moniker.length > 14
            ? `${moniker.substring(0, 14)}...`
            : moniker}
        </Text>
      </Text>
      <IntupAutoSize
        value={toSend}
        onChangeInputAmount={onChangeInputAmount}
        placeholder="amount"
      />
      <Text marginLeft={10} fontSize="16px" color="#fff">
        {DENOM_CYBER.toUpperCase()}
      </Text>
    </ActionBarContainer>
  );
}

export function ReDelegate({
  generateTx,
  onChangeInputAmount,
  toSend,
  disabledBtn,
  validators,
  validatorsAll,
  valueSelect,
  onChangeReDelegate,
  onClickBack,
}) {
  return (
    <ActionBarContainer
      onClickBack={onClickBack}
      button={{
        text: T.actionBar.delegate.generate,
        onClick: generateTx,
        disabled: disabledBtn,
      }}
    >
      <IntupAutoSize
        value={toSend}
        onChangeInputAmount={onChangeInputAmount}
        placeholder="amount"
      />
      <Text marginLeft={5} fontSize="16px" color="#fff">
        {DENOM_CYBER.toUpperCase()} restake to:
      </Text>
      <select
        style={{
          width: '120px',
        }}
        value={valueSelect}
        onChange={onChangeReDelegate}
      >
        <option value="">pick hero</option>
        {validatorsAll
          .filter(
            (validator) =>
              BOND_STATUS[validator.status] === BOND_STATUS.BOND_STATUS_BONDED
          )
          .map((item) => (
            <option
              key={item.operatorAddress}
              value={item.operatorAddress}
              style={{
                display:
                  validators.operatorAddress === item.operatorAddress
                    ? 'none'
                    : 'block',
              }}
            >
              {item.description.moniker}
            </option>
          ))}
      </select>
    </ActionBarContainer>
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
    <ActionBarContainer
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

        <IntupAutoSize
          value={valueInputAmount}
          onChangeInputAmount={onChangeInputAmount}
          placeholder="amount"
          autoFocus={false}
        />
      </div>
    </ActionBarContainer>
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
            {CYBER.DENOM_CYBER.toUpperCase()}
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
  selectNetworkFunc,
  selectNetwork,
  connctAddress,
  web3,
  selectAccount,
  keplr,
  onClickBack,
}) {
  const [cyberNetwork, setCyberNetwork] = useState(true);
  const [cosmosNetwork, setCosmosNetwork] = useState(true);
  const [ethNetwork, setEthrNetwork] = useState(true);

  useEffect(() => {
    if (selectAccount && selectAccount !== null) {
      if (selectAccount.cyber) {
        setCyberNetwork(false);
      } else {
        setCyberNetwork(true);
      }
      if (selectAccount.cosmos) {
        setCosmosNetwork(false);
      } else {
        setCosmosNetwork(true);
      }
      if (selectAccount.eth) {
        setEthrNetwork(false);
      } else {
        setEthrNetwork(true);
      }
    } else {
      setEthrNetwork(true);
      setCosmosNetwork(true);
      setCyberNetwork(true);
    }
  }, [selectAccount]);

  return (
    <ActionBarContainer
      button={{
        disabled: !selectNetwork || !selectMethod,
        text: 'Connect',
        onClick: connctAddress,
      }}
      onClickBack={onClickBack}
    >
      <Pane display="flex" alignItems="center" justifyContent="center" flex={1}>
        {(cyberNetwork || cosmosNetwork) && (
          <>
            {/* <ButtonIcon
                onClick={() => selectMethodFunc('ledger')}
                active={selectMethod === 'ledger'}
                img={imgLedger}
                text="ledger"
              /> */}
            {keplr ? (
              <ButtonIcon
                onClick={() => selectMethodFunc('keplr')}
                active={selectMethod === 'keplr'}
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
          </>
        )}
        {web3 && web3 !== null && ethNetwork && (
          <ButtonIcon
            onClick={() => selectMethodFunc('MetaMask')}
            active={selectMethod === 'MetaMask'}
            img={imgMetaMask}
            text="metaMask"
          />
        )}
        {(cyberNetwork || cosmosNetwork) && (
          <ButtonIcon
            onClick={() => selectMethodFunc('read-only')}
            active={selectMethod === 'read-only'}
            img={imgRead}
            text="read-only"
          />
        )}
      </Pane>
      <span style={{ fontSize: '18px' }}>in</span>
      <Pane display="flex" alignItems="center" justifyContent="center" flex={1}>
        {selectMethod === 'MetaMask' && (
          <ButtonIcon
            img={imgEth}
            text="eth"
            onClick={() => selectNetworkFunc('eth')}
            active={selectNetwork === 'eth'}
          />
        )}
        {selectMethod !== 'MetaMask' && (
          <>
            {cyberNetwork && (
              <ButtonIcon
                onClick={() => selectNetworkFunc('cyber')}
                active={selectNetwork === 'cyber'}
                img={selectNetworkImg(CYBER.CHAIN_ID)}
                text={CYBER.CHAIN_ID}
              />
            )}
            {cosmosNetwork && (
              <ButtonIcon
                img={imgCosmos}
                text="cosmos"
                onClick={() => selectNetworkFunc('cosmos')}
                active={selectNetwork === 'cosmos'}
              />
            )}
          </>
        )}
      </Pane>
    </ActionBarContainer>
  );
}
