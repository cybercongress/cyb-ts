import React, { useContext, useEffect, useState } from 'react';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import BigNumber from 'bignumber.js';
import { ActionBar, Input, Button, Pane } from '@cybercongress/gravity';
import {
  SigningCosmosClient,
  GasPrice,
  coins,
  makeSignDoc,
  makeStdTx,
} from '@cosmjs/launchpad';
import { CosmosDelegateTool } from '../../utils/ledger';
import {
  ConnectLadger,
  JsonTransaction,
  TransactionSubmitted,
  Confirmed,
  TransactionError,
  ActionBarContentText,
  Dots,
  CheckAddressInfo,
  ButtonImgText,
  Account,
} from '../../components';
import { AppContext } from '../../context';

import { downloadObjectAsJson } from '../../utils/utils';

import { getTxs } from '../../utils/search/utils';

import {
  LEDGER,
  CYBER,
  PATTERN_CYBER,
  PROPOSAL_STATUS,
  DEFAULT_GAS_LIMITS,
  VOTE_OPTION,
} from '../../utils/config';

const imgKeplr = require('../../image/keplr-icon.svg');
const imgLedger = require('../../image/ledger.svg');
const imgCyber = require('../../image/blue-circle.png');

const {
  MEMO,
  HDPATH,
  LEDGER_OK,
  STAGE_INIT,
  STAGE_SELECTION,
  STAGE_LEDGER_INIT,
  STAGE_READY,
  STAGE_WAIT,
  STAGE_SUBMITTED,
  STAGE_CONFIRMING,
  STAGE_CONFIRMED,
  STAGE_ERROR,
} = LEDGER;
const LEDGER_TX_ACOUNT_INFO = 10;

const STAGE_CLI_ADD_ADDRESS = 1.3;
const STAGE_GENERATION_TX = 12.2;

function ActionBarDetail({ proposals, id, addressActive, update }) {
  const { keplr, jsCyber } = useContext(AppContext);
  const [stage, setStage] = useState(STAGE_INIT);
  const [txHash, setTxHash] = useState(null);
  const [txHeight, setTxHeight] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [valueSelect, setValueSelect] = useState(1);
  const [valueDeposit, setValueDeposit] = useState('');

  useEffect(() => {
    const confirmTx = async () => {
      if (jsCyber !== null && txHash !== null) {
        setStage(STAGE_CONFIRMING);
        const response = await getTxs(txHash);
        console.log('response :>> ', response);

        const responseGetTx = await jsCyber.getTx(txHash);
        console.log('responseGetTx :>> ', responseGetTx);

        if (response && response !== null) {
          if (response.logs) {
            setStage(STAGE_CONFIRMED);
            setTxHeight(response.height);
            if (update) {
              update();
            }
            return;
          }
          if (response.code) {
            setStage(STAGE_ERROR);
            setTxHeight(response.height);
            setErrorMessage(response.raw_log);
            return;
          }
        }
        setTimeout(confirmTx, 1500);
      }
    };
    confirmTx();
  }, [jsCyber, txHash]);

  const cleatState = () => {
    setStage(STAGE_INIT);
    setTxHash(null);
    setTxHeight(null);
    setErrorMessage(null);
    setValueDeposit('');
    setValueSelect(1);
  };

  const generateTxKeplr = async () => {
    if (keplr !== null && Object.keys(proposals).length > 0) {
      try {
        const [{ address }] = await keplr.signer.getAccounts();
        if (addressActive !== null && addressActive.bech32 === address) {
          // let amount = [];
          // if (parseFloat(valueDeposit) > 0) {
          //   amount = coins(parseFloat(valueDeposit), CYBER.DENOM_CYBER);
          // }
          let response = {};
          const fee = {
            amount: [],
            gas: DEFAULT_GAS_LIMITS.toString(),
          };

          setStage(STAGE_SUBMITTED);

          if (
            proposals.status === PROPOSAL_STATUS.PROPOSAL_STATUS_VOTING_PERIOD
          ) {
            response = await keplr.voteProposal(
              address,
              id,
              valueSelect,
              fee,
              CYBER.MEMO_KEPLR
            );
          }

          if (
            proposals.status === PROPOSAL_STATUS.PROPOSAL_STATUS_DEPOSIT_PERIOD
          ) {
            const amount = coins(parseFloat(valueDeposit), CYBER.DENOM_CYBER);
            response = await keplr.depositProposal(
              address,
              id,
              amount,
              fee,
              CYBER.MEMO_KEPLR
            );
          }

          console.log(`response`, response);
          if (response.code === 0) {
            setTxHash(response.transactionHash);
          } else {
            setTxHash(null);
            setErrorMessage(response.rawLog.toString());
            setStage(STAGE_ERROR);
          }
        } else {
          setErrorMessage(
            <span>
              Add address <Account margin="0 5px" address={address} /> to your
              pocket or make active{' '}
            </span>
          );
          setStage(STAGE_ERROR);
        }
      } catch (e) {
        console.log(e);
        setTxHash(null);
        setErrorMessage(e.toString());
        setStage(STAGE_ERROR);
      }
    }
    // if (keplr !== null) {
    //   if (period === 'deposit') {
    //     msgs.push({
    //       type: 'cosmos-sdk/MsgDeposit',
    //       value: {
    //         amount,
    //         depositor: accounts.address,
    //         proposal_id: id,
    //       },
    //     });
    //   }

    //   if (period === 'vote') {
    //     msgs.push({
    //       type: 'cosmos-sdk/MsgVote',
    //       value: {
    //         option: valueSelect,
    //         voter: accounts.address,
    //         proposal_id: id,
    //       },
    //     });
    //   }
    // }
  };

  if (stage === STAGE_INIT && Object.keys(proposals).length === 0) {
    return (
      <ActionBar>
        <ActionBarContentText>
          <Dots />
        </ActionBarContentText>
      </ActionBar>
    );
  }

  if (
    stage === STAGE_INIT &&
    proposals.status === PROPOSAL_STATUS.PROPOSAL_STATUS_DEPOSIT_PERIOD
  ) {
    return (
      <ActionBar>
        <ActionBarContentText>
          <Pane marginRight={10}>send Deposit</Pane>
          <Input
            textAlign="end"
            value={valueDeposit}
            onChange={(e) => setValueDeposit(e.target.value)}
            marginRight={10}
            width={100}
            autoFocus
          />
          <Pane>{CYBER.DENOM_CYBER.toUpperCase()}</Pane>
        </ActionBarContentText>
        <ButtonImgText
          text={
            <Pane alignItems="center" display="flex">
              Deposit
              <img
                src={imgCyber}
                alt="cyber"
                style={{
                  width: 20,
                  height: 20,
                  marginLeft: '5px',
                  paddingTop: '2px',
                  objectFit: 'contain',
                }}
              />
            </Pane>
          }
          disabled={!parseFloat(valueDeposit) > 0}
          onClick={() => generateTxKeplr()}
          img={imgKeplr}
        />
      </ActionBar>
    );
  }

  if (
    stage === STAGE_INIT &&
    proposals.status === PROPOSAL_STATUS.PROPOSAL_STATUS_VOTING_PERIOD
  ) {
    return (
      <ActionBar>
        <ActionBarContentText>
          <select
            style={{ height: 42, width: '200px' }}
            className="select-green"
            value={valueSelect}
            onChange={(e) => setValueSelect(e.target.value)}
          >
            <option value={VOTE_OPTION.VOTE_OPTION_YES}>Yes</option>
            <option value={VOTE_OPTION.VOTE_OPTION_NO}>No</option>
            <option value={VOTE_OPTION.VOTE_OPTION_ABSTAIN}>Abstain</option>
            <option value={VOTE_OPTION.VOTE_OPTION_NO_WITH_VETO}>
              NoWithVeto
            </option>
          </select>
        </ActionBarContentText>
        <ButtonImgText
          text={
            <Pane alignItems="center" display="flex">
              Vote
              <img
                src={imgCyber}
                alt="cyber"
                style={{
                  width: 20,
                  height: 20,
                  marginLeft: '5px',
                  paddingTop: '2px',
                  objectFit: 'contain',
                }}
              />
            </Pane>
          }
          onClick={() => generateTxKeplr()}
          img={imgKeplr}
        />
      </ActionBar>
    );
  }

  // if (stage === STAGE_CLI_ADD_ADDRESS) {
  //   return (
  //     <ActionBar>
  //       <ActionBarContentText>
  //         <Pane marginRight={10}>Put your cyber address</Pane>
  //         <Input
  //           textAlign="end"
  //           value={valueAddress}
  //           onChange={this.onChangeValueAddress}
  //           marginRight={10}
  //           width={170}
  //           autoFocus
  //         />
  //       </ActionBarContentText>
  //       <Button
  //         disabled={!valueAddress.match(PATTERN_CYBER)}
  //         onClick={this.onClickPutAddress}
  //       >
  //         put
  //       </Button>
  //     </ActionBar>
  //   );
  // }

  if (stage === LEDGER_TX_ACOUNT_INFO) {
    return <CheckAddressInfo />;
  }

  if (stage === STAGE_SUBMITTED) {
    return (
      <ActionBar>
        <ActionBarContentText>
          check the transaction <Dots big />
        </ActionBarContentText>
      </ActionBar>
    );
  }

  if (stage === STAGE_CONFIRMING) {
    return <TransactionSubmitted />;
  }

  if (stage === STAGE_CONFIRMED) {
    return (
      <Confirmed
        txHash={txHash}
        txHeight={txHeight}
        onClickBtnCloce={() => cleatState()}
      />
    );
  }

  if (stage === STAGE_ERROR && errorMessage !== null) {
    return (
      <TransactionError
        errorMessage={errorMessage}
        onClickBtn={() => cleatState()}
      />
    );
  }

  return null;
}

export default ActionBarDetail;
