/* eslint-disable react/no-children-prop */
import React, { useContext, useEffect, useState } from 'react';
import {
  Pane,
  Text,
  TableEv as Table,
  ActionBar,
} from '@cybercongress/gravity';
import { fromAscii, fromBase64 } from '@cosmjs/encoding';
import { Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import {
  Votes,
  Legend,
  IconStatus,
  Deposit,
  ContainerPane,
  Item,
} from '../../components';

import {
  getProposals,
  getStakingPool,
  getTallying,
  getProposalsDetail,
  getProposer,
  getProposalsDetailVotes,
  getMinDeposit,
  getTableVoters,
  getTallyingProposals,
} from '../../utils/governance';
import ActionBarDetail from './actionBarDatail';

import { formatNumber } from '../../utils/utils';

import ProposalsIdDetail from './proposalsIdDetail';
import ProposalsDetailProgressBar from './proposalsDetailProgressBar';
import ProposalsIdDetailTableVoters from './proposalsDetailTableVoters';
import { CYBER, VOTE_OPTION } from '../../utils/config';
import useSetActiveAddress from '../../hooks/useSetActiveAddress';
import { AppContext } from '../../context';

const finalTallyResult = (item) => {
  const finalVotes = {
    yes: 0,
    no: 0,
    abstain: 0,
    noWithVeto: 0,
    finalTotalVotes: 0,
  };
  let finalTotalVotes = 0;
  const yes = parseInt(item.yes, 10);
  const abstain = parseInt(item.abstain, 10);
  const no = parseInt(item.no, 10);
  const noWithVeto = parseInt(item.no_with_veto, 10);

  finalTotalVotes = yes + abstain + no + noWithVeto;
  if (finalTotalVotes !== 0) {
    finalVotes.yes = (yes / finalTotalVotes) * 100;
    finalVotes.no = (no / finalTotalVotes) * 100;
    finalVotes.abstain = (abstain / finalTotalVotes) * 100;
    finalVotes.noWithVeto = (noWithVeto / finalTotalVotes) * 100;
    finalVotes.finalTotalVotes = finalTotalVotes;
  }

  return finalVotes;
};

const descriptionTest =
  '\nSummary of the proposal:\n\n- Change Signed Blocks Window from 300 to 1200.\n\nCurrent Network slashing parameters define that each validator must sign at least 70% of blocks in 300-block window.\n\n Converting those parameters into time, implying average block time of 5.75 seconds, gives us around 8.5 minutes of continuous downtime for each validator without jailing. But assuming current state of the chain, with almost half-million links in it, simply restart the node requires from 10 to 15 minutes even on the most nodes. That simply means that validator cannot restart the node without being jailed.\n\nHereby i propose to change Signed Blocks Window key of slashing module to value 1200 blocks. That will allow ~35 minutes of continuous downtime for validator before being jailed.\n\nThus validator operator will get enough time to perform hardware of software upgrades without fine for jailing.';

function ProposalsDetail({ defaultAccount }) {
  const { proposalId } = useParams();
  const { jsCyber } = useContext(AppContext);
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const [proposals, setProposals] = useState({});
  const [updateFunc, setUpdateFunc] = useState(0);
  const [tally, setTally] = useState({
    participation: 0,
    yes: 0,
    abstain: 0,
    no: 0,
    noWithVeto: 0,
  });
  const [tallying, setTallying] = useState({
    quorum: 0,
    threshold: 0,
    veto_threshold: 0,
  });

  const [votes, setVotes] = useState({
    yes: 0,
    no: 0,
    abstain: 0,
    noWithVeto: 0,
    voter: [],
  });

  const [totalDeposit, setTotalDeposit] = useState(0);
  const [minDeposit, setMinDeposit] = useState(0);

  useEffect(() => {
    const getProposalsInfo = async () => {
      setProposals({});
      let proposalsInfo = {};
      let totalDepositAmount = 0;
      if (proposalId && proposalId > 0) {
        const responseProposalsDetail = await getProposalsDetail(proposalId);
        proposalsInfo = { ...responseProposalsDetail };
        const {
          title,
          description,
          plan,
          changes,
          recipient,
          amount,
        } = responseProposalsDetail.content.value;
        proposalsInfo.title = title;
        proposalsInfo.type = responseProposalsDetail.content.type;
        proposalsInfo.description = description;

        if (plan) {
          proposalsInfo.plan = plan;
        }
        if (changes) {
          proposalsInfo.changes = changes;
        }
        if (recipient) {
          proposalsInfo.recipient = recipient;
        }
        if (amount) {
          proposalsInfo.amount = amount;
        }

        const responseProposer = await getProposer(proposalId);

        if (responseProposer !== null) {
          proposalsInfo.proposer = responseProposer.proposer;
        }

        if (responseProposalsDetail.total_deposit.length) {
          totalDepositAmount = parseFloat(
            responseProposalsDetail.total_deposit[0].amount
          );
        }
      }
      setTotalDeposit(totalDepositAmount);
      setProposals(proposalsInfo);
    };
    getProposalsInfo();
  }, [proposalId, updateFunc]);

  useEffect(() => {
    const getStatusVoting = async () => {
      setProposals({});
      let tallyTemp = {};
      let participation = 0;
      let tallyResult = {};
      if (proposalId && proposalId > 0) {
        const stakingPool = await getStakingPool();

        const tallyingResponse = await getTallying();
        if (tallyingResponse !== null) {
          setTallying({ ...tallyingResponse });
        }

        const responceTallyingProposals = await getTallyingProposals(
          proposalId
        );

        if (responceTallyingProposals !== null) {
          tallyResult = responceTallyingProposals;
        } else {
          tallyResult = proposals.final_tally_result;
        }

        tallyTemp = finalTallyResult(tallyResult);
        participation =
          (tallyTemp.finalTotalVotes / stakingPool.bonded_tokens) * 100;
        tallyTemp.participation = participation;
      }
      setTally(tallyTemp);
    };
    getStatusVoting();
  }, [proposalId, updateFunc]);

  useEffect(() => {
    const getDeposit = async () => {
      let minDepositAmount = 0;
      const minDepositData = await getMinDeposit();
      if (minDepositData !== null) {
        minDepositAmount = parseFloat(minDepositData.min_deposit[0].amount);
      }

      setMinDeposit(minDepositAmount);
    };
    getDeposit();
  }, [updateFunc]);

  useEffect(() => {
    const getVotes = async () => {
      const votesTemp = {};
      let yes = [];
      let no = [];
      let abstain = [];
      let noWithVeto = [];
      const resultgProposalsDetailVotes = await getProposalsDetailVotes(
        proposalId
      );
      if (resultgProposalsDetailVotes) {
        yes = resultgProposalsDetailVotes.filter(
          (item) => item.option === VOTE_OPTION.VOTE_OPTION_YES
        ).length;
        no = resultgProposalsDetailVotes.filter(
          (item) => item.option === VOTE_OPTION.VOTE_OPTION_NO
        ).length;
        abstain = resultgProposalsDetailVotes.filter(
          (item) => item.option === VOTE_OPTION.VOTE_OPTION_ABSTAIN
        ).length;
        noWithVeto = resultgProposalsDetailVotes.filter(
          (item) => item.option === VOTE_OPTION.VOTE_OPTION_NO_WITH_VETO
        ).length;
      }
      votesTemp.voter = resultgProposalsDetailVotes;
      votesTemp.yes = yes;
      votesTemp.no = no;
      votesTemp.abstain = abstain;
      votesTemp.noWithVeto = noWithVeto;

      setVotes(votesTemp);
    };
    getVotes();
  }, [proposalId, updateFunc]);

  const getSubStr = (str) => {
    let string = str;
    if (string.indexOf('cosmos-sdk/') !== -1) {
      string = string.slice(string.indexOf('/') + 1);
      return string;
    }
    return string;
  };

  console.log(`proposals`, proposals);
  console.log(`addressActive`, addressActive)

  return (
    <div>
      <main className="block-body">
        <Pane paddingBottom={50}>
          <Pane height={70} display="flex" alignItems="center">
            <Text paddingLeft={20} fontSize="18px" color="#fff">
              {proposals.title && ` #${proposalId} ${proposals.title}`}
            </Text>
          </Pane>

          {proposals.status && (
            <Pane paddingLeft={20} marginBottom={10}>
              <IconStatus status={proposals.status} text marginRight={8} />
            </Pane>
          )}
          <ContainerPane marginBottom={20}>
            <Item
              marginBottom={15}
              title="Proposer"
              value={
                <Link to={`/network/bostrom/contract/${proposals.proposer}`}>
                  {proposals.proposer}
                </Link>
              }
            />
            {proposals.type && (
              <Item
                marginBottom={15}
                title="Type"
                value={getSubStr(proposals.type)}
              />
            )}
            {proposals.recipient && (
              <Item
                title="Recipient"
                marginBottom={15}
                value={
                  <Link to={`/network/bostrom/contract/${proposals.recipient}`}>
                    {proposals.recipient}
                  </Link>
                }
              />
            )}
            {proposals.amount && (
              <Item
                title="Amount"
                marginBottom={15}
                value={`${formatNumber(
                  parseFloat(proposals.amount[0].amount)
                )} ${proposals.amount[0].denom.toUpperCase()}`}
              />
            )}
            {proposals.description && (
              <Item
                title="Description"
                value={
                  <Pane className="container-description">
                    <ReactMarkdown
                      children={proposals.description.replace(/\\n/g, '\n')}
                    />
                  </Pane>
                }
              />
            )}
            {proposals.changes && Object.keys(proposals.changes).length > 0 && (
              <Item
                title="Changes"
                value={
                  <Pane className="container-description">
                    {proposals.changes.map((item) => (
                      <Pane>
                        {item.subspace}: {item.key} {item.value}
                      </Pane>
                    ))}
                  </Pane>
                }
              />
            )}
            {proposals.plan && (
              <Item
                title="Plan"
                value={
                  <Pane className="container-description">
                    <Pane>name: {proposals.plan.name}</Pane>
                    <Pane>height: {proposals.plan.height}</Pane>
                  </Pane>
                }
              />
            )}
          </ContainerPane>

          <ProposalsIdDetail
            proposals={proposals}
            tallying={tallying}
            tally={tally}
            totalDeposit={0}
            marginBottom={20}
          />

          <ProposalsDetailProgressBar
            proposals={proposals}
            totalDeposit={totalDeposit}
            minDeposit={minDeposit}
            tallying={tallying}
            tally={tally}
          />

          <ProposalsIdDetailTableVoters votes={votes} />
        </Pane>
      </main>
      {addressActive !== null && addressActive.keys === 'keplr' ? (
        <ActionBarDetail
          id={proposalId}
          proposals={proposals}
          minDeposit={minDeposit}
          totalDeposit={totalDeposit}
          update={() => setUpdateFunc((item) => item + 1)}
          addressActive={addressActive}
        />
      ) : (
        <ActionBar>
          <Pane>
            <Link
              style={{
                paddingTop: 10,
                paddingBottom: 10,
                display: 'block',
              }}
              className="btn"
              to="/"
            >
              add address to your pocket from keplr
            </Link>
          </Pane>
        </ActionBar>
      )}
    </div>
  );
}

const mapStateToProps = (store) => {
  return {
    defaultAccount: store.pocket.defaultAccount,
  };
};

export default connect(mapStateToProps)(ProposalsDetail);
