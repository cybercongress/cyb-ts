/* eslint-disable react/no-children-prop */
import { useEffect, useState } from 'react';
import { Pane, Text, ActionBar } from '@cybercongress/gravity';
import { Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { ProposalStatus } from 'cosmjs-types/cosmos/gov/v1beta1/gov';

import { ContainerGradientText, IconStatus, Item } from '../../components';

import {
  getStakingPool,
  getTallying,
  getProposalsDetail,
  getProposer,
  getTallyingProposals,
} from '../../utils/governance';
import ActionBarDetail from './actionBarDatail';

import { formatNumber } from '../../utils/utils';

import ProposalsDetailProgressBar from './proposalsDetailProgressBar';
import useSetActiveAddress from '../../hooks/useSetActiveAddress';
import { MainContainer } from '../portal/components';
import ProposalsRoutes from './proposalsRoutes';

import styles from './proposalsDetail.module.scss';
import { useGovParam } from 'src/hooks/governance/params/useGovParams';

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

function ProposalsDetail({ defaultAccount }) {
  const { proposalId } = useParams();
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

  const [totalDeposit, setTotalDeposit] = useState(0);
  const { paramData: minDeposit, isLoading, error } = useGovParam('deposit');

  useEffect(() => {
    const getProposalsInfo = async () => {
      setProposals({});
      let proposalsInfo = {};
      let totalDepositAmount = 0;
      if (proposalId && proposalId > 0) {
        const responseProposalsDetail = await getProposalsDetail(proposalId);
        if (Object.keys(responseProposalsDetail).length > 0) {
          proposalsInfo = { ...responseProposalsDetail };
          const { title, description, plan, changes, recipient, amount } =
            responseProposalsDetail.content;
          proposalsInfo.title = title;
          proposalsInfo.type = responseProposalsDetail.content['@type'];
          proposalsInfo.description = description;
          proposalsInfo.status = ProposalStatus[responseProposalsDetail.status];

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposalId, updateFunc]);

  const getSubStr = (str) => {
    let string = str;
    if (string.indexOf('cosmos-sdk/') !== -1) {
      string = string.slice(string.indexOf('/') + 1);
      return string;
    }
    return string;
  };

  return (
    <>
      <MainContainer width="100%">
        <Pane display="flex" alignItems="center">
          <Text fontSize="25px" color="#fff">
            {proposals.title && ` #${proposalId} ${proposals.title}`}
          </Text>
        </Pane>
        {proposals.status && (
          <Pane>
            <IconStatus status={proposals.status} text marginRight={8} />
          </Pane>
        )}
        <ContainerGradientText>
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
                <Pane className={styles.containerDescription}>
                  <ReactMarkdown
                    children={proposals.description.replace(/\\n/g, '\n')}
                    rehypePlugins={[rehypeSanitize]}
                    remarkPlugins={[remarkGfm]}
                  />
                </Pane>
              }
            />
          )}
          {proposals.changes && Object.keys(proposals.changes).length > 0 && (
            <Item
              title="Changes"
              value={
                <Pane className={styles.containerDescription}>
                  {proposals.changes.map((item) => (
                    <Pane key={item.key}>
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
                <Pane className={styles.containerDescription}>
                  <Pane>name: {proposals.plan.name}</Pane>
                  <Pane>height: {proposals.plan.height}</Pane>
                </Pane>
              }
            />
          )}
        </ContainerGradientText>
        <ProposalsDetailProgressBar
          proposals={proposals}
          totalDeposit={totalDeposit}
          minDeposit={minDeposit}
          tallying={tallying}
          tally={tally}
        />

        <ProposalsRoutes
          proposals={proposals}
          tallying={tallying}
          tally={tally}
          totalDeposit={totalDeposit}
          updateFunc={updateFunc}
        />
      </MainContainer>
      {addressActive !== null &&
      addressActive.keys === 'keplr' &&
      location.pathname === `/senate/${proposalId}/voters` ? (
        <ActionBarDetail
          id={proposalId}
          proposals={proposals}
          minDeposit={minDeposit}
          totalDeposit={totalDeposit}
          update={() => setUpdateFunc((item) => item + 1)}
          addressActive={addressActive}
        />
      ) : (
        !addressActive && (
          <ActionBar>
            <Pane>
              <Link
                style={{
                  paddingTop: 10,
                  paddingBottom: 10,
                  display: 'block',
                }}
                className="btn"
                to="/keys"
              >
                connect
              </Link>
            </Pane>
          </ActionBar>
        )
      )}
    </>
  );
}

const mapStateToProps = (store) => {
  return {
    defaultAccount: store.pocket.defaultAccount,
  };
};

export default connect(mapStateToProps)(ProposalsDetail);
