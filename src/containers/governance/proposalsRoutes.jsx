import { Routes, Route } from 'react-router-dom';
import { ProposalStatus } from 'cosmjs-types/cosmos/gov/v1beta1/gov';

import ProposalsDetailTableComments from './proposalsDetailTableComments';
import ProposalsIdDetail from './proposalsIdDetail';
import ProposalsIdDetailTableVoters from './proposalsDetailTableVoters';
import Layout from './tabsLayout';

function ProposalsRoutes({
  proposalId,
  proposals,
  tallying,
  tally,
  totalDeposit,
  updateFunc,
}) {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={<ProposalsDetailTableComments proposalId={proposalId} />}
        />
        <Route path="comments" element={<ProposalsDetailTableComments />} />
        <Route
          path="meta"
          element={
            <ProposalsIdDetail
              proposals={proposals}
              tallying={tallying}
              tally={tally}
              totalDeposit={totalDeposit}
            />
          }
        />
        <Route
          path="voters"
          element={
            proposals.status > ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD ? (
              <ProposalsIdDetailTableVoters
                proposalId={proposalId}
                updateFunc={updateFunc}
              />
            ) : null
          }
        />
      </Route>
    </Routes>
  );
}

export default ProposalsRoutes;
