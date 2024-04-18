import { Routes, Route } from 'react-router-dom';
import ProposalsDetailTableComments from './ProposalsDetailTableComments';
import ProposalsIdDetail from './proposalsIdDetail';
import styles from './styles.scss';
import ProposalsIdDetailTableVoters from './proposalsDetailTableVoters';
import Layout from './tabsLayout';

function ProposalsRoutes({
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
        <Route index element={<ProposalsDetailTableComments />} />
        <Route path="comments" element={<ProposalsDetailTableComments />} />
        <Route
          path="meta"
          element={
            <div className={styles.meta}>
              <ProposalsIdDetail
                proposals={proposals}
                tallying={tallying}
                tally={tally}
                totalDeposit={totalDeposit}
              />
            </div>
          }
        />
        <Route
          path="voters"
          element={
            proposals.status > proposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD ? (
              <ProposalsIdDetailTableVoters updateFunc={updateFunc} />
            ) : null
          }
        />
      </Route>
    </Routes>
  );
}

export default ProposalsRoutes;
