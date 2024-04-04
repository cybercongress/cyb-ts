import { Routes, Route } from 'react-router-dom';
import ProposalsDetailTableComments from './proposalsDetailTableComments';
import ProposalsIdDetail from './proposalsIdDetail';
import ProposalsIdDetailTableVoters from './proposalsDetailTableVoters';
import Layout from './Layout';

function ProposalsRoutes({
  proposalId,
  proposals,
  tallying,
  tally,
  totalDeposit,
  updateFunc,
  proposalStatus,
}) {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={<ProposalsDetailTableComments proposalId={proposalId} />}
        />
        <Route
          path="comments"
          element={<ProposalsDetailTableComments proposalId={proposalId} />}
        />
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
            proposals.status > proposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD ? (
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
